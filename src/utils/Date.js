export const days = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
];

export const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
];

export const formatDate = (dateString) => {
    let date = new Date(dateString);
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth() - 1]} ${date.getFullYear()}`
};

export const formatTime = (dateString) => {
    let date = new Date(dateString);
    let strTime = date.toLocaleTimeString('fr-FR');
    return strTime.substring(0, strTime.length - 3)
};

export const formatDateTime = (dateString) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`
};