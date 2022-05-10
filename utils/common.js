export function padLeftZero(value, length) {
    return (value.toString().length < length) ? padLeftZero('0' + value, length) : value;
}