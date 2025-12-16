import {
  AuthenticatorTransportFuture,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse
} from '@simplewebauthn/server'
import express from 'express'
import { NewPasskey, Passkey } from '~/models/schemas/passkey'
import { User } from '~/models/schemas/user'
import {
  getRegistrationChallenge,
  getUserPasskeys,
  saveRegistrationChallenge,
  saveUpdatedCounter,
  saveUserPasskey
} from '~/services/passkey.services'
import { getUserByEmail } from '~/services/users.services'
import { passkeyRPConfigs } from '~/utils/configs'
import { GetAuthenticationOptionsDTO, VerifyAuthenticationDTO } from './dto'

export const getPasskeyOptions = async (req: express.Request, res: express.Response) => {
  try {
    const user: User = res.locals.user
    const userPasskeys: Passkey[] = await getUserPasskeys(user.id)

    const options: PublicKeyCredentialCreationOptionsJSON = await generateRegistrationOptions({
      rpName: passkeyRPConfigs.rpName,
      rpID: passkeyRPConfigs.rpID,
      userName: user.fullName || user.email,
      attestationType: 'none',
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform'
      }
    })

    await saveRegistrationChallenge(user.id, options.challenge)

    return res.status(200).json({
      options
    })
  } catch (error) {
    console.error(error)
    return res.status(400).send({ error: error })
  }
}

export const verifyRegistration = async (req: express.Request, res: express.Response) => {
  try {
    const user: User = res.locals.user
    const currentOptions = await getRegistrationChallenge(user.id)

    if (!currentOptions) {
      return res.status(400).json({ message: 'No registration challenge found or challenge expired' })
    }

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: currentOptions,
      expectedOrigin: passkeyRPConfigs.origin,
      expectedRPID: passkeyRPConfigs.rpID
    })

    const { verified, registrationInfo } = verification

    if (!registrationInfo) {
      return res.status(400).json({ message: 'Registration verification failed' })
    }

    const { credential, credentialDeviceType, credentialBackedUp } = registrationInfo

    const newPasskey: NewPasskey = {
      userId: user.id,
      webAuthnUserID: user.id,
      id: credential.id,
      // @ts-ignore
      publicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      transports: credential.transports?.join(',') || null,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp
    }

    await saveUserPasskey(newPasskey)

    return res.status(200).json({ verified })
  } catch (error) {
    console.error(error)
    return res.status(400).send({ error: error })
  }
}

export const getAuthenticationOptions = async (req: express.Request, res: express.Response) => {
  try {
    const dto = GetAuthenticationOptionsDTO.safeParse(req.query)

    if (!dto.success) {
      return res.status(400).json({ message: 'Invalid request parameters' })
    }

    const email = dto.data.email

    const users = await getUserByEmail(email)

    if (!users || users.length === 0) return res.sendStatus(400)

    const { id } = users[0]

    const userPasskeys: Passkey[] = await getUserPasskeys(id)

    const options: PublicKeyCredentialRequestOptionsJSON = await generateAuthenticationOptions({
      rpID: passkeyRPConfigs.rpID,
      allowCredentials: userPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports?.split(',') as AuthenticatorTransport[]
      }))
    })

    await saveRegistrationChallenge(id, options.challenge)

    return res.status(200).json({ options })
  } catch (error) {
    console.error(error)
    return res.status(400).send({ error: error })
  }
}

export const verifyAuthentication = async (req: express.Request, res: express.Response) => {
  try {
    const { body } = req
    const dto = VerifyAuthenticationDTO.safeParse(req.query)

    if (!dto.success) {
      return res.status(400).json({ message: 'Invalid request parameters' })
    }

    const email = dto.data.email

    const users = await getUserByEmail(email)

    if (!users || users.length === 0) return res.sendStatus(400)

    const { id } = users[0]

    const expectedChallenge = await getRegistrationChallenge(id)
    const userPasskeys: Passkey[] = await getUserPasskeys(id)

    if (!expectedChallenge) {
      return res.status(400).json({ message: 'No authentication challenge found or challenge expired' })
    }

    const passkey = userPasskeys.find((pk) => pk.id === body.id)

    if (!passkey) {
      return res.status(400).json({ message: 'No passkey found for user' })
    }

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: expectedChallenge,
      expectedOrigin: passkeyRPConfigs.origin,
      expectedRPID: passkeyRPConfigs.rpID,
      credential: {
        id: passkey.id,
        publicKey: new Uint8Array(Buffer.from(passkey.publicKey)),
        counter: passkey.counter,
        transports: passkey.transports ? (passkey.transports.split(',') as AuthenticatorTransportFuture[]) : undefined
      }
    })

    const { verified } = verification

    const { authenticationInfo } = verification
    const { newCounter } = authenticationInfo

    await saveUpdatedCounter(passkey, newCounter)

    return res.status(200).json({ verified })
  } catch (error) {
    console.error(error)
    return res.status(400).send({ error: error })
  }
}
