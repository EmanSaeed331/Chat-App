const socket = io()
// Elements 
const $messageForm  = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton= $messageForm.querySelector('button')
const $sendlocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
/* - on accepts two things :
       1) the name of the event 
       2) the function to run when event occurs
*/
/* socket.on('countUpdated' , (count) =>{
    console.log('countUpdated' , count)
})
document.querySelector('#increament').addEventListener('click', ()=>{
    console.log('Clicked')
    socket.emit('increament')
})
 */
//Options
const {username, room }=Qs.parse(location.search , {ignoreQueryPrefix:true})
socket.on('message',(message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message:message.text ,
        createdAt: moment(message.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend' , html)
})
socket.on('locationMessage' , (url)=>{
    const html = Mustache.render(locationMessageTemplate,{
        url :url.url , 
        createdAt: moment(url.createdAt).format('hh:mm a')

    })
    $messages.insertAdjacentHTML('beforeend', html)

})
$messageForm .addEventListener('submit',(e) =>{
        // (e.preventDefault()) --> to prevent default behavior  
        e.preventDefault()
         $messageFormButton.setAttribute('disabled','disabled')
       // const message = document.querySelector('input').value
       const message = e.target.elements.message.value
       socket.emit('sendMessage',message, (error)=>{
        //enable 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
       if(error){
           return console.log(error)
       }
       console.log('Message delivered')
       })
    })
    $sendlocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    //disabled location btn while sending location 
    $sendlocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        } , ()=>{ 
            $sendlocationButton.removeAttribute('disabled')

            console.log('Location shared ')

        })
    })
})
socket.emit('join' , { username,room })