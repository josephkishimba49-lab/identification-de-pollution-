# Firebase Security Rules - Security Spec

## Data Invariants
1. A User profile can only be created by the user themselves (uid matches document id).
2. Users can only update their own profiles.
3. Users cannot elevate their own roles to Admin.
4. App requires users to be authenticated to access any data.

## The "Dirty Dozen" Payloads

1. **Spoofed Creation**: Create a user profile where `uid` does not match the `{userId}` path.
2. **Ghost Update**: Update profile with an unknown field.
3. **Role Elevation**: Update profile by setting `role` to `admin`.
4. **Invalid Type**: Set `name` to an array instead of string.
5. **No Auth Read**: Read a user profile without being signed in.
6. **Cross-User Update**: Update another user's profile.
7. **Cross-User Delete**: Delete another user's profile.
8. **Invalid ID**: Try to create user profile with document ID > 128 chars.
9. **Bad Timestamp**: Try to create profile with `createdAt` not equal to server timestamp.
10. **Immutable Field Modification**: Ensure `createdAt` cannot be changed on update.
11. **Spoof Email Verification**: Admin creation or any operation where email isn't verified (but we only use popup login, assuming google login gives verified emails).
12. **Missing required fields**: Create a profile without required fields.

## The Test Runner
(We'll just write the final valid security rules using standard validated patterns)
