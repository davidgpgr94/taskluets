
export function csrf_input_token(this: any) {
  return `<input type="hidden" name="_csrf" value="${this.csrfToken()}" />`;
}
