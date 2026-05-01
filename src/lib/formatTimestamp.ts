import { formatDistanceToNow } from "date-fns";

export const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true
    });
};