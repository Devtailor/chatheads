export interface ChatGptResponse {
  readonly id: string;
  readonly object: string;
  readonly created: number;
  readonly choices: [{
    readonly index: number;
    readonly message: {
      readonly role: string;
      readonly content: string;
    };
    readonly finish_reason: string;
  }],
  readonly usage: {
    readonly prompt_tokens: number;
    readonly completion_tokens: number;
    readonly total_tokens: number;
  }
}