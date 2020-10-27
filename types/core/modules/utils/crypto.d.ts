declare module '$:/core/modules/utils/crypto' {
  export function extractEncryptedStoreArea(text: string): string | null;
  export function decryptStoreArea(
    encryptedStoreArea: string,
    password: string
  ): Tiddler[];
}
