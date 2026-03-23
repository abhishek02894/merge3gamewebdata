export function verifyApiSecret(request: Request): boolean {
  const auth = request.headers.get("authorization")
  if (!auth) return false
  const token = auth.replace("Bearer ", "")
  return token === process.env.API_SECRET
}
