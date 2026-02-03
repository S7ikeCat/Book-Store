export const decodeToken = (token: string) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
      } catch (e) {
        console.error("Failed to decode token:", e);
        return null;
      }
  };