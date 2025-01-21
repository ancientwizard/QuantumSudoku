
export
function toISO8601Z(date: Date): string
{
    const pad = (num: number) => String(num).padStart(2, '0');

    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1);
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}


// vim: expandtab number tabstop=4 shiftwidth=4 softtabstop=2 fileformat=unix
// END
