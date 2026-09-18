// Builds the argv used to launch the LÖVE binary. Keeping this as a separate
// argv array (passed to execFile, never concatenated into a shell string) is
// what prevents a crafted `love.binaryPath` or project path from being
// interpreted as shell syntax.
export function buildLoveInvocation(
  loveBinary: string,
  lovePath: string
): { command: string; args: string[] } {
  return { command: loveBinary, args: [lovePath] };
}
