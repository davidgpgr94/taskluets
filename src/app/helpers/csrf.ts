
export function csrf_input_token(options: any) {
  return `<input type="hidden" name="_csrf" value="${options.data.root.csrfToken()}" />`;
}
