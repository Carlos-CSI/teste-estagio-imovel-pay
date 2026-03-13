export function formatarData(data){
    const dia=`${data[8]}${data[9]}`
    const mes=`${data[5]}${data[6]}`
    const ano=`${data[2]}${data[3]}`
    return `${dia}/${mes}/${ano}`
}
export function formatarHorario(data){
    const dia=formatarData(data)
    const horas=`${data[11]}${data[12]}`
    const minutos=`${data[14]}${data[15]}`
    return `${horas}:${minutos} ${dia}`
}