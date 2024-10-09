import * as animationFunction from '/js/gsap/indexAnimations.js';

//#region [ MONITOR VIEW ]

// Needs to be global to clear automatic executuion instance...!
var automatedSearchInstance

//#region Timeline

$('#manSearch_btn').click(function()
{
    let maneuverID_input = $('#moniID_input').val().trim().toUpperCase()

    if (!validateField(maneuverID_input)) 
    {
        $('#errorToastPrompt').text("⛟ Debes llenar el campo.")
        $('.toast-error').css('display','grid').hide().fadeIn(200).delay(2000).fadeOut(200)   
    }else
    {
        $.ajax(
        {
            //url: 'http://localhost:8080/man/findManeuver',
            url: 'https://maylob-backend.onrender.com/man/findManeuver',
            type: "get",
            dataType: 'json',
            data:maneuverID_input,
            success : (function (data) 
            {
                if (data.message == '0') 
                {
                    $('.pop-error').removeClass('hidden')
                    $('.pop-error').addClass('pop-up')
                    $('.pop-up').fadeIn(500)
                    $('#errorText').text("⛟ MANIOBRA NO ENCONTRADA")
                    $('#errorText').append("<p>🛈 Revisa el ID ingresado.</p>") 
                }else
                {  
                    animationFunction.forwardNavigation('moniSearch','moniView')
                    animationFunction.changeViewTitle('bannerText_prompt',data.foundManeuver[0].maneuver_id)

                    let foundEvents = data.foundManeuver[0].maneuver_events.length

                    $("#main_timeline").text("")
                    /* for (let index = 0; index < foundEvents/3; index++) 
                    {
                        fillTimeline(data.foundManeuver[0].maneuver_events[index*3],data.foundManeuver[0].maneuver_events[index*3+1],data.foundManeuver[0].maneuver_events[index*3+2])
                    } */

                        for (let index = (foundEvents-1); index > 0; index-=4) 
                        {
                            if (data.foundManeuver[0].maneuver_events[index] === '100%')
                            {
                                fillTimeline(data.foundManeuver[0].maneuver_events[index-3],data.foundManeuver[0].maneuver_events[index-2],data.foundManeuver[0].maneuver_events[index-1],data.foundManeuver[0].maneuver_events[index],true)
                            }else
                            {
                                fillTimeline(data.foundManeuver[0].maneuver_events[index-3],data.foundManeuver[0].maneuver_events[index-2],data.foundManeuver[0].maneuver_events[index-1],data.foundManeuver[0].maneuver_events[index],false)
                            }
                        }

                    automatedSearchInstance = setInterval(function()
                    {
                        getEvents(maneuverID_input)
                    }, 15000
                    )

                    let containersLength = data.foundManeuver[0].maneuver_containers.length

                    for (let index = 0; index < containersLength; index++) 
                    {
                        switch (index) 
                        {
                            case 0:
                                validateField(data.foundManeuver[0].maneuver_containers[index])?
                                ($('#cont_data1').text(data.foundManeuver[0].maneuver_containers[index]))
                                :
                                ($('#cont_data1').text("-"))
                            break;
                        
                            case 2:
                                validateField(data.foundManeuver[0].maneuver_containers[index])?
                                ($('#cont_data2').text(data.foundManeuver[0].maneuver_containers[index]))
                                :
                                ($('#cont_data2').text("-"))   
                            
                            break;
                        
                            case 4:
                                validateField(data.foundManeuver[0].maneuver_containers[index])?
                                ($('#cont_data3').text(data.foundManeuver[0].maneuver_containers[index]))
                                :
                                ($('#cont_data3').text("-"))
                            break;
                        
                            case 6:
                                validateField(data.foundManeuver[0].maneuver_containers[index])?
                                ($('#cont_data4').text(data.foundManeuver[0].maneuver_containers[index]))
                                :
                                ($('#cont_data4').text("-"))
                            break;
                        }
                    }
                }              
            }),

            error: function(serverResponse) 
            {   
                //console.log(serverResponse);
                $('#errorToastPrompt').text("Error al conectar con el servidor")
                $('.toast-error').css('display','grid').hide().fadeIn(200).delay(2000).fadeOut(200);
            },
            complete: function() 
            {
                $('.toast-loader').fadeOut(500)
                animationFunction.animateTruck(false)
            }, 

            //async:false
        })
    }
})

//#endregion Timeline





//#region pop-ups

// Details pop-up...
$('#openManeuverData_pop').click(function()
{
    $('#maneuverData-pop').css('display','flex').hide().fadeIn(250); 

    //LOADER..!
    $('.toast-loader').css('display','grid').hide().fadeIn(200);
    animationFunction.animateTruck(true)

    /** - Step [1]  
    *   - Search maneuver in DB by AJAX request...
    */

    let maneuverID_input = $('#moniID_input').val().trim().toUpperCase()

    $.ajax({
        //url: 'http://localhost:8080/man/findManeuver',
        url: 'https://maylob-backend.onrender.com/man/findManeuver',
        type: "get",
        dataType: 'json',
        data:maneuverID_input,
        success : (function (data) 
        {

            if (data.message == '0') 
            {
               $('.pop-error').removeClass('hidden')
               $('.pop-error').addClass('pop-up')
               $('.pop-up').fadeIn(500)
               $('#errorText').text("No se encontró la maniobra")
               $('#errorText').append("<p>Revisa el ID ingresado.</p>") 

            }else
            {  
                let containersLength = data.foundManeuver[0].maneuver_containers.length

                for (let index = 0; index < containersLength; index++) 
                {
                    switch (index) 
                    {
                        case 0:
                            validateField(data.foundManeuver[0].maneuver_containers[index])?
                            (
                            $('#container_A_ID').text(data.foundManeuver[0].maneuver_containers[index]),      
                            $('#container_A_size').text(data.foundManeuver[0].maneuver_containers[index+1])      
                            ):
                            (
                            $('#container_A_ID').text("Sin contenedor"),      
                            $('#container_A_size').text("-")        
                            )
                        break;
                        
                        case 2:
                            validateField(data.foundManeuver[0].maneuver_containers[index])?
                            (
                            $('#container_B_ID').text(data.foundManeuver[0].maneuver_containers[index]),      
                            $('#container_B_size').text(data.foundManeuver[0].maneuver_containers[index+1])      
                            ):
                            (
                            $('#container_B_ID').text("Sin contenedor"),      
                            $('#container_B_size').text("-")        
                            )
                        break;

                        case 4:
                            validateField(data.foundManeuver[0].maneuver_containers[index])?
                            (
                            $('#container_C_ID').text(data.foundManeuver[0].maneuver_containers[index]),      
                            $('#container_C_size').text(data.foundManeuver[0].maneuver_containers[index+1])      
                            ):
                            (
                            $('#container_C_ID').text("Sin contenedor"),      
                            $('#container_C_size').text("-")        
                            )
                        break;

                        case 6:
                            validateField(data.foundManeuver[0].maneuver_containers[index])?
                            (
                            $('#container_D_ID').text(data.foundManeuver[0].maneuver_containers[index]),      
                            $('#container_D_size').text(data.foundManeuver[0].maneuver_containers[index+1])      
                            ):
                            (
                            $('#container_D_ID').text("Sin contenedor"),      
                            $('#container_D_size').text("-")        
                            )    
                        break;
                    }
                }

                $('#maneuverID_prompt').text(data.foundManeuver[0].maneuver_id)
                $('#maneuverDate_prompt').text(data.foundManeuver[0].maneuver_planned_date)
                $('#maneuverClient_prompt').text(data.foundManeuver[0].maneuver_customer)
                $('#maneuverSize_prompt').text(data.foundManeuver[0].maneuver_size)
                $('#maneuverType_prompt').text(data.foundManeuver[0].maneuver_type)
                $('#maneuverOrigin_prompt').text(data.foundManeuver[0].maneuver_origin)
                $('#maneuverDestination_prompt').text(data.foundManeuver[0].maneuver_destination)
                $('#maneuverOperator_prompt').text(data.foundManeuver[0].maneuver_operator)
                
            }              
        }),

        error: function(serverResponse) 
        {   
            //console.log(serverResponse);
            $('#errorToastPrompt').text("Error al conectar con el servidor")
            $('.toast-error').css('display','grid').hide().fadeIn(200).delay(2000).fadeOut(200);
        },
        complete: function() 
        {
            $('.toast-loader').fadeOut(500)
            animationFunction.animateTruck(false)
        }, 

        async:false
     })
})


$('#closeManeuverData_pop').click(function()
{
    $('#maneuverData-pop').fadeOut(250)
})


// Tracking pop-up...
$('#openGPS_pop').click(function()
{
    $('#gps-pop').css('display','flex').hide().fadeIn(250); 

    let maneuverID_input = $('#moniID_input').val().trim().toUpperCase()

    $('#trackingMap').empty()
    getGPS(maneuverID_input)
    
})

$('#closeGPS-pop').click(function()
{
    $('#gps-pop').fadeOut(250)
})


//#endregion pop-ups


/** BACKWARD NAVIGATION */
$('#back2MS_MONI').click(function()
{
    clearInterval(automatedSearchInstance)

    animationFunction.goBackAnimation('moniView','moniSearch')
    animationFunction.changeViewTitle('bannerText_prompt','Monitor')
})

//#endregion [ MONITOR VIEW ]

/**
 * +==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+
 * +                                                                                               +
 * + [⚑] AUXILIARY FUCTIONS...                                                                     +
 * +                                                                                               +
 * +==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+
 */ 

function getGPS(maneuver_id)
{
    //LOADER...!
    $('.toast-loader').css('display','grid').hide().fadeIn(200);
    animationFunction.animateTruck(true)

    $.ajax({
        //url: 'http://localhost:8080/man/getGPS',
        url: 'https://maylob-backend.onrender.com/man/getGPS',
        type: 'get',
        contentType: 'application/json',
        data: maneuver_id,
        success : (function (data) 
        {
            console.log(data.trackingLink);

            if (data.trackingLink!='POR DEFINIR') 
            {
                showGPS(data.trackingLink)        
            }else
            {
                $('.pop-error').removeClass('hidden')
                $('.pop-error').addClass('pop-up')
                $('.pop-up').fadeIn(500)
                $('#errorText').text("⛟ No hay TRACKING disponible.")
                $('#errorText').append("<p>🛈 Estamos actualizando el tracking.</p>")
            }
        }),

        error: function(XMLHttpRequest, textStatus, errorThrown) 
        {  
            $('.pop-error').removeClass('hidden')
            $('.pop-error').addClass('pop-up')
            $('.pop-up').fadeIn(500)
            $('#errorText').text("⛟ LINK NO ACTUALIZADO")
            $('#errorText').append("<p>🛈 El servidor no pudo procesar el guardado.</p>")
        },

        complete: function() 
        {
            $('.toast-loader').fadeOut(200)
            animationFunction.animateTruck(false)
        },
    
        //async:false
    })     

}





function getEvents(maneuverID_input)
{
    //LOADER...!
    $('.toast-loader').css('display','grid').hide().fadeIn(200);
    animationFunction.animateTruck(true)

    $.ajax({
        //url: 'http://localhost:8080/man/findManeuver',
        url: 'https://maylob-backend.onrender.com/man/findManeuver',
        type: "get",
        dataType: 'json',
        data:maneuverID_input,
        success : (function (data) 
        {
            if (data.message != '0') 
            {
                let foundEvents = data.foundManeuver[0].maneuver_events.length

                $("#main_timeline").text("")

                for (let index = (foundEvents-1); index > 0; index-=4) 
                {
                    if (data.foundManeuver[0].maneuver_events[index] === "100%")
                    {
                        fillTimeline(data.foundManeuver[0].maneuver_events[index-3],data.foundManeuver[0].maneuver_events[index-2],data.foundManeuver[0].maneuver_events[index-1],data.foundManeuver[0].maneuver_events[index],true)
                    }else
                    {
                        fillTimeline(data.foundManeuver[0].maneuver_events[index-3],data.foundManeuver[0].maneuver_events[index-2],data.foundManeuver[0].maneuver_events[index-1],data.foundManeuver[0].maneuver_events[index],false)
                    }
                }
            }              
        }),

        error: function(serverResponse) 
        {   
            //console.log(serverResponse);
            $('#errorToastPrompt').text("⛟ Error al conectar con el servidor")
            $('.toast-error').css('display','grid').hide().fadeIn(200).delay(2000).fadeOut(200);
        },

        complete: function() 
        {
            $('.toast-loader').fadeOut(500)
            animationFunction.animateTruck(false)
        }, 

        //async:false
    })
}





/** Execute this to fill tracking embeded...
 * 
 */
function showGPS(maneuverGPSlink)
{
    $("#trackingMap").append(
        
        "<embed src='"+maneuverGPSlink+"' class='top view_100'>"
    )
}





/** Execute this to fill timeline elements...
 * 
 */
function fillTimeline(eventTime,eventLocation,eventStatus,eventPercentage,completed)
{
    if (eventPercentage === "0%") 
    {
        $("#main_timeline").append(
            "<div class='eventContainer flexCentered'>"+
            "<div class='eventCard-data'>"+
            "<div class='flexCentered eventCard-time'>"+
            "<p>PREPARANDO MANIOBRA</p>"+
            "</div>"+
            "<div class='flexCentered eventCard-steps '>"+
            "<img src='img/truck.svg' alt='truck'>"+
            "<p class='eventCard-step-percentage'>"+eventPercentage+"</p>"+
            "</div>           "+
            "<div class='flexCentered eventCard-dataContainer'>"+
            "<div class='eventCard-eventLogo flexCentered'>"+
            "<img src='img/ubicacion.svg' alt='truck'>"+
            "</div>"+
            "<div class='eventCard-eventInfo gray-text'>"+
            eventLocation+
            "</div>"+
            "</div>"+
            "<div class='flexCentered eventCard-dataContainer'>"+
            "<div class='eventCard-eventLogo flexCentered'>"+
            "<img src='img/inventory_img.svg' alt='truck'>"+
            "</div>"+
            "<div class=' eventCard-eventInfo gray-text'>"+
            eventStatus+
            "</div>"+
            "</div>"+
            "</div>"+
            "<div class='eventCard-color orange-bg'></div>"+
            "</div>"
        )   
    }else
    {
        $("#main_timeline").append(
            "<div class='eventContainer flexCentered'>"+
            "<div class='eventCard-data'>"+
            "<div class='flexCentered eventCard-time'>"+
            "<p>"+eventTime+"</p>"+
            "</div>"+
            "<div class='flexCentered eventCard-steps '>"+
            "<img src='img/truck.svg' alt='truck'>"+
            "<p class='eventCard-step-percentage'>"+eventPercentage+"</p>"+
            "</div>           "+
            "<div class='flexCentered eventCard-dataContainer'>"+
            "<div class='eventCard-eventLogo flexCentered'>"+
            "<img src='img/ubicacion.svg' alt='truck'>"+
            "</div>"+
            "<div class='eventCard-eventInfo gray-text'>"+
            eventLocation+
            "</div>"+
            "</div>"+
            "<div class='flexCentered eventCard-dataContainer'>"+
            "<div class='eventCard-eventLogo flexCentered'>"+
            "<img src='img/inventory_img.svg' alt='truck'>"+
            "</div>"+
            "<div class=' eventCard-eventInfo gray-text'>"+
            eventStatus+
            "</div>"+
            "</div>"+
            "</div>"+
            "<div class='eventCard-color orange-bg'></div>"+
            "</div>"+
            "<div class='eventPoint flexCentered '></div>"+
            "<div class='eventPath'></div>"
        )
    }

    
/*     if (!completed) 
    {
        $("#main_timeline").append(
            "<div class='eventPoint flexCentered '></div>"+
            "<div class='eventPath'></div>"+
            "<div class='eventContainer flexCentered'>"+
            "<div class='eventCard-data'>"+
            "<div class='flexCentered eventCard-time'>"+
            "<p>"+eventTime+"</p>"+
            "</div>"+
            "<div class='flexCentered eventCard-steps '>"+
            "<img src='img/truck.svg' alt='truck'>"+
            "<p class='eventCard-step-percentage'>"+eventPercentage+"</p>"+
            "</div>           "+
            "<div class='flexCentered eventCard-dataContainer'>"+
            "<div class='eventCard-eventLogo flexCentered'>"+
            "<img src='img/ubicacion.svg' alt='truck'>"+
            "</div>"+
            "<div class='eventCard-eventInfo gray-text'>"+
            eventLocation+
            "</div>"+
            "</div>"+
            "<div class='flexCentered eventCard-dataContainer'>"+
            "<div class='eventCard-eventLogo flexCentered'>"+
            "<img src='img/inventory_img.svg' alt='truck'>"+
            "</div>"+
            "<div class=' eventCard-eventInfo gray-text'>"+
            eventStatus+
            "</div>"+
            "</div>"+
            "</div>"+
            "<div class='eventCard-color orange-bg'></div>"+
            "</div>"
        )
    }else
    {
        $("#main_timeline").append(
            "<div class='eventContainer flexCentered'>"+
            "<div class='eventCard-data'>"+
            "<div class='flexCentered eventCard-time'>"+
            "<p class='green-text'>"+eventTime+"</p>"+
            "</div>"+
            "<div class='flexCentered eventCard-steps '>"+
            "<img src='img/ok_logo.svg' alt='truck'>"+
            "<p class='eventCard-step-percentage green-text'>"+eventPercentage+"</p>"+
            "</div>           "+
            "<div class='flexCentered eventCard-dataContainer'>"+
            "<div class='eventCard-eventLogo flexCentered'>"+
            "<img src='img/ubicacion.svg' alt='truck'>"+
            "</div>"+
            "<div class='eventCard-eventInfo green-text'>"+
            eventLocation+
            "</div>"+
            "</div>"+
            "<div class='flexCentered eventCard-dataContainer'>"+
            "<div class='eventCard-eventLogo flexCentered'>"+
            "<img src='img/inventory_img.svg' alt='truck'>"+
            "</div>"+
            "<div class=' eventCard-eventInfo green-text'>"+
            eventStatus+
            "</div>"+
            "</div>"+
            "</div>"+
            "<div class='eventCard-color green-bg'></div>"+
            "</div>"
        )
    } */


}





/** Use to validate that no value is empty... 
 * @param {*} fieldValue 
 * @returns true if valid
 */
function validateField(fieldValue)
{
    //console.log(fieldValue);
    if (fieldValue === undefined || fieldValue === "" || fieldValue === null) 
    {
        return false
    }else
    {
        return true
    }          
}


/**POP-UP */
$('#closeError').click(function()
{
    $('.pop-up').fadeOut(500);
    $('.pop-error').removeClass('pop-up')
    $('.pop-error').addClass('hidden')
})

/**POP-UP */
$('#closeOK').click(function()
{   
    $('.pop-up').fadeOut(500);
    $('.pop-ok').removeClass('pop-up')
    $('.pop-ok').addClass('hidden')

    getAvailableManeuvers()
})
