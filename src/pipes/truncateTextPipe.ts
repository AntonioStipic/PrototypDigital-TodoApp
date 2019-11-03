export const truncateTextPipe = (value: any) => {

    let maxLen = 48;

    return value.length > maxLen ? `${value.substring(0, maxLen)}...` : value;
};