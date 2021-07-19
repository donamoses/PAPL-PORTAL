var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];



export function getWeekDay(date:Date)
{
    return days[ date.getDay() ];

}
export function getMonth(date:Date)
{
    return months[ date.getMonth() ];
}