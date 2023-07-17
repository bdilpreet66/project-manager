import commonStyles from "../theme/commonStyles";

export const getStatus = (status) => {
    switch(status) {
        case 'overdue': 
        return commonStyles.badgeError;
        case 'completed':
        return commonStyles.badgeSucess;
        case 'pending':
        return commonStyles.badgeWarning;
        case 'in-progress':
        return commonStyles.badgeInfo;
        default:
        return commonStyles.badgeDefault;
    }
}