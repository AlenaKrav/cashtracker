export function formatCurrency(quantity: number){
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(quantity)
};

export function formatDate(isoString: string){
    const date = new Date(isoString);
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    return formattedDate.format(date)
}