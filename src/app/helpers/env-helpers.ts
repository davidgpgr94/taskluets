
export function isDevelopment(block: any) {
  if (process.env.NODE_ENV === 'development') {
    return block.fn();
  } else {
    return block.inverse();
  }
}
