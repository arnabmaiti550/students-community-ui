// composables/useHexEncoding.js
export function useHexEncoding() {
    function utf8ToHex(str) {
        // Convert string to a UTF-8 encoded byte array
        const utf8Bytes = new TextEncoder().encode(str);

        // Convert each byte to a hexadecimal string and join them together
        return Array.from(utf8Bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function hexToUtf8(hex) {
        // Convert the hexadecimal string back to a byte array
        const byteArray = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        // Decode the byte array back to a UTF-8 string
        return new TextDecoder().decode(byteArray);
    }

    return {
        utf8ToHex,
        hexToUtf8
    };
}
