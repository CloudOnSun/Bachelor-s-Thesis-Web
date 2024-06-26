export const config = {
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
};

export const authConfig = (token?: string) => ({
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'allowedOriginPatterns',
        Authorization: `Bearer ${token}`,
    }
});

export const fileConfig = (token?: string) => ({
   headers: {
       'Content-Type': 'multipart/form-data',
       'Access-Control-Allow-Origin': '*',
       Authorization: `Bearer ${token}`,
   }
});

export const getLogger: (tag: string) => (...args: any) => void =
    tag => (...args) => console.log(tag, ...args);