export function parseRange(value) {
    try {
        let from = 0, to = 0;
        if (!value) {
            console.log('no value found ', value)
            return { from, to };
        }
        if (value.startsWith('>')) {
            // Case for ">" prefix
            from = parseFloat(value.replace(/[^0-9.]/g, ''));
            to = 99999
        } else if (value.startsWith('<')) {
            // Case for "<" prefix
            from = 0;
            to = parseFloat(value.replace(/[^0-9.]/g, ''));
        } else if (value.includes('-')) {
            // Case for range "X-Y"
            const [start, end] = value.split('-').map(part => parseFloat(part.replace(/[^0-9.]/g, '')));
            from = start;
            to = end;
        } else {
            // Single value
            from = parseFloat(value.replace(/[^0-9.]/g, ''));
        }

        return { from, to };
    } catch (err) {
        console.log(err)
    }
}