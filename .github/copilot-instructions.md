# Be My Coin - Backend API

Node.js + TypeScript + Express REST API with MySQL (Drizzle ORM), JWT authentication, 2FA, and Google OAuth.

## Architecture

**Three-Layer Pattern:**

- `controllers/` - Receive requests, validate with Zod DTOs, call services, return responses
- `services/` - Business logic and database operations using Drizzle ORM
- `middlewares/` - Authentication, validation, error handling

**Path Alias:** Use `~/` for imports (maps to `src/`). Example: `import { users } from '~/models/schemas/user'`

## Critical Patterns

### Error Handling

Use `BackendError` class with error codes (not HTTP status):

```typescript
throw new BackendError('USER_NOT_FOUND') // Auto-converts to 404
throw new BackendError('UNAUTHORIZED', { message: 'Token not found' })
```

See [src/utils/errors.ts](src/utils/errors.ts) for all error codes.

### Handler Creation

Always wrap controllers with `createHandler()` for automatic error catching:

```typescript
export const enable2FA = createHandler(async (req, res, next) => {
  // No try-catch needed - errors auto-forwarded to error middleware
})
```

### Authentication

- JWT stored in cookies (`ACCESS_TOKEN` key from `COOKIE_KEYS`)
- Use `isAuthenticated()` middleware - adds `res.locals.user`
- Auth controllers in `controllers/auth/` return both `accessToken` and `refreshToken`

### Validation

- DTOs defined with Zod in `controllers/auth/dto.ts`
- Parse with `.safeParse()` in controllers, return 400 on validation error
- Example: `UserLoginDTO.safeParse(req.body)`

## Database (Drizzle ORM)

**Schema:** MySQL tables defined in `models/schemas/` with snake_case columns

```typescript
// Schema definition
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'), // snake_case in DB
  twoFAEnabled: boolean('two_fa_enabled').default(false)
})
```

**Service Pattern:** All DB queries in `services/` files

```typescript
// services/users.services.ts
export const getUserById = async (id: number) => {
  const [user] = await db.select().from(users).where(eq(users.id, id))
  return user
}
```

**Migrations:**

```bash
npm run db:generate   # Generate migration from schema changes
npm run db:migrate    # Apply migrations
npm run db:studio     # Open Drizzle Studio UI
```

## Development Workflow

```bash
npm run dev           # Start with nodemon + hot reload
npm run build         # TypeScript build with path alias resolution
npm run start         # Run production build

npm run lint:fix      # Auto-fix ESLint + Prettier
npm run prettier:fix
```

**Environment:** Requires `.env` with `PORT`, `DATABASE_NAME`, `USER_DB`, `PASSWORD`, `HOST`, `GOOGLE_CLIENT_ID`, JWT secrets

## Key Files

- [src/index.ts](src/index.ts) - Express app setup, CORS, middleware chain
- [src/routes/index.ts](src/routes/index.ts) - Main router mounting `/api/v1/` prefix
- [src/routes/auth.route.ts](src/routes/auth.route.ts) - Auth endpoints: login, register, Google OAuth, 2FA
- [src/utils/create.ts](src/utils/create.ts) - `createHandler()` utility with Zod integration
- [src/models/drizzle.config.ts](src/models/drizzle.config.ts) - Drizzle Kit config for migrations

## Authentication Flow

1. **Standard Login:** POST `/api/v1/auth/login` → checks 2FA → returns tokens or `2FA_REQUIRED`
2. **Google OAuth:** POST `/api/v1/auth/google-login` with `Authorization: Bearer <idToken>` → auto-creates user if not exists
3. **2FA Login:** POST `/api/v1/auth/login-2fa` with email, password, token
4. **Refresh:** POST `/api/v1/auth/refresh-token` with `refreshToken` and `accessToken`

## Common Pitfalls

- Don't use `express.Router()` directly - import pre-configured routers
- Never bypass `createHandler()` - it handles async errors
- Use service layer for DB queries, not in controllers
- Import from `~/` not relative paths for src files
- Run `npm run db:migration` after schema changes before testing
