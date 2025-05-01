import * as animationFunction from '/js/gsap/indexAnimations.js';

var current_page = ''

// Used for local testing...
var API_URL = 'http://localhost:8080'
//var API_URL = 'https://maylob-backend.onrender.com'

// Needs to be global to clear automatic executuion instance...!
var automatedSearchInstance
var searchInstance





//#region [ NAV BAR ]

//Backward navigation...
$('#goBack_btn').click(function()
{
    switch (current_page) 
    {
        case 'moniView':
           current_page = animationFunction.navigateToView('moniView','search_view',false,'flex')
        break;
    
        default: break;
    }
});

$('#save_btn').click(function()
{
    switch (current_page) 
    {
        case 'maneuversPage':

        break;

        case 'addManeuverPage':
         //  saveNewManeuver() 
        break;
    
        default: break;
    }
});

$('#filter_btn').click(function()
{
    switch (current_page) 
    {
        case 'maneuversPage':
            animationFunction.growAnimation('filter_container',false,'flex')
        break;
    
        default: break;
    }
});

//#endregion [ NAV BAR ]




//#region    [ LANDING PAGE / MANEUVERS PAGE ]

$('#search_key_trigger_btn').click(function()
{
    let search_key_value = $('#search_key_txt_input').val().trim()
    let notification_msg = ''

    if (!validateField(search_key_value)) 
    {
        notification_msg = ['¡Dato no válido! ⛟ ','* Debes ingresar la llave en el campo de texto.']
        display_notification('warning', notification_msg) 
    }else
    {
        //LOADER...!
        $('#truck_loader').css('display','flex').hide().fadeIn(200);
        animationFunction.animateTruck(true)
        
        $.ajax({
            url:          API_URL+'/man/getClientManeuvers',
            type:        'get',
            contentType: 'application/json',
            data:         search_key_value,
            success : (function (data) 
            {   
                if (data.message === '0') 
                {
                    notification_msg = ['¡No encontramos maniobras! ⛟ '
                        ,'* Revisa que hayas ingresado tu llave correctamente.'
                        ,'* Si tu llave es la correcta puede que no haya maniobras activas en curso.']
                    display_notification('warning', notification_msg) 
                }else
                {
                    current_page = animationFunction.navigateToView('search_view','moniView',false,'flex')
                    $('#maneuvuers_scrollableContainer').empty()
                    for (let index = 0; index < data.foundManeuver.length; index++) 
                    {
                        fillDashboard(data.foundManeuver[index])
                    }
                }
            }),
    
            error: function(XMLHttpRequest, textStatus, errorThrown) 
            {  
                notification_msg = ['¡No pudimos accedr a los datos! ⛟ ','* Hubo un problema con la solicitud al servidor.']
                display_notification('error', notification_msg) 
            },
    
            complete: function() 
            {
                $('#truck_loader').fadeOut(200)
                animationFunction.animateTruck(false)
            },
        
            //async:false
        }) 
    }
})


function fillDashboard(parameters)
{
    let isFinished   = validateField(parameters.man_termino) ? parameters.man_termino : "Aún en curso"
    let changeMainBG = isFinished != "Aún en curso" ? "mi_bg_2":"mi_bg_1"
    
    let container_1_data = [parameters.manCont_1_id,parameters.manCont_1_size, parameters.manCont_1_peso,parameters.manCont_1_tipo, parameters.manCont_1_contenido]
    let c1_class
    switch (container_1_data[1]) 
    {
        case '20':
            c1_class = container_1_data[2] > 20 && container_1_data[1] <= 26 ? "cu_2" : (container_1_data[2] > 26 ? "cu_3":"cu_1")
        break;
    
        case '40':
            c1_class = container_1_data[2] > 26 && container_1_data[2] <= 30 ? "cu_2" : (container_1_data[2] > 30 ? "cu_3":"cu_1")
        break;
    }

    let container_2_data = [parameters.manCont_2_id,parameters.manCont_2_size, parameters.manCont_2_peso,parameters.manCont_2_tipo, parameters.manCont_2_contenido]
    let c2_class
    switch (container_2_data[1]) 
    {
        case '20':
            c2_class = container_2_data[2] > 20 && container_2_data[1] <= 26 ? "cu_2" : (container_2_data[2] > 26 ? "cu_3":"cu_1")
        break;
    
        case '40':
            c2_class = container_2_data[2] > 26 && container_2_data[2] <= 30 ? "cu_2" : (container_2_data[2] > 30 ? "cu_3":"cu_1")
        break;
    }
 
    let container_3_data = [parameters.manCont_3_id,parameters.manCont_3_size, parameters.manCont_3_peso,parameters.manCont_3_tipo, parameters.manCont_3_contenido]
    let c3_class
    switch (container_3_data[1]) 
    {
        case '20':
            c3_class = container_3_data[2] > 20 && container_3_data[1] <= 26 ? "cu_2" : (container_3_data[2] > 26 ? "cu_3":"cu_1")
        break;
    
        case '40':
            c3_class = container_3_data[2] > 26 && container_3_data[2] <= 30 ? "cu_2" : (container_3_data[2] > 30 ? "cu_3":"cu_1")
        break;
    }

    let container_4_data = [parameters.manCont_4_id,parameters.manCont_4_size, parameters.manCont_4_peso,parameters.manCont_4_tipo, parameters.manCont_4_contenido]
    let c4_class
    switch (container_4_data[1]) 
    {
        case '20':
            c4_class = container_4_data[2] > 20 && container_4_data[1] <= 26 ? "cu_2" : (container_4_data[2] > 26 ? "cu_3":"cu_1")
        break;
    
        case '40':
            c4_class = container_4_data[2] > 26 && container_4_data[2] <= 30 ? "cu_2" : (container_4_data[2] > 30 ? "cu_3":"cu_1")
        break;
    }
 
   $('#maneuvuers_scrollableContainer').append(
    "<div class='maneuver_item "+changeMainBG+"'>"+
    "<div class='maneuver_top_row'>"+
    "<table class='maneuver_main_table'>"+
    "<tr>"+
    "<th class='tableData_cntr'>1ER CONTENEDOR</th>"+
    "<th class='tableData_percentage'>%</th>"+
    "<th class='tableData_location'>UBICACIÓN</th>"+
    "<th class='tableData_status'>ESTATUS</th>"+
    "<th class='tableData_client'>CLIENTE</th>"+
    "<th class='tableData_mode'>MODALIDAD</th>"+
    "<th class='tableData_dispatch'>F. DESPACHO</th>"+
    "<th class='tableData_finish'>F. TÉRMINO</th>"+
    "</tr>"+
    "<tr>"+
    "<td>"+parameters.manCont_1_id+"</td>"+
    "<td>"+parameters.maneuver_events[parameters.maneuver_events.length-1]+"</td>"+
    "<td>"+parameters.maneuver_current_location+"</td>"+
    "<td>"+parameters.maneuver_current_status+"</td>"+
    "<td>"+parameters.man_cliente+"</td>"+
    "<td>"+parameters.man_modalidad+"</td>"+
    "<td>"+parameters.man_despacho+"</td>"+
    "<td>"+isFinished+"</td>"+
    "</tr>"+
    "</table>"+
    "<button class='expand_btn'>"+
    "<img src='img/nav_arrow_white.svg' alt='expand row arrow'>"+
    "</button>"+
    "</div>"+
    "<div class='collapsable_row expandable'>"+
    "<div class='maneuver_middle_row '>"+
    "<table class='man_general_details '>"+
    "<tr>"+
    "<th>TRANSPORTISTA</th>"+
    "<th>ECO</th>"+
    "<th>PLACAS</th>"+
    "<th>OPERADOR</th>"+
    "</tr>"+
    "<tr>"+
    "<td>"+parameters.man_transportista+"</td>"+
    "<td>"+parameters.man_eco+"</td>"+
    "<td>"+parameters.man_placas+"</td>"+
    "<td>"+parameters.man_operador+"S</td>"+
    "</table>"+
    "<table class='man_general_details '>"+
    "<tr>"+
    "<th>A. ADUANAL</th>"+
    "<th>EJECUTIVA</th>"+
    "<th>CAAT</th>"+
    "<th>TERMINAL DE CARGA</th>"+
    "<th>PATIO DE DESCARGA</th>"+
    "<th>BLOQUE TURNO</th>"+
    "</tr>"+
    "<tr>"+
    "<td>"+parameters.man_aa+"</td>"+
    "<td>"+parameters.man_ejecutiva+"</td>"+
    "<td>"+parameters.man_caat+"</td>"+
    "<td>"+parameters.man_terminal+"</td>"+
    "<td>"+parameters.man_descarga+"</td>"+
    "<td>"+parameters.man_despacho+"</td>"+
    "</tr>"+
    "</table>"+
    "</div>"+
    "<div class='maneuver_bot_row '>"+
    "<div class='maneuver_containers'>"+
    "<div class='container_unit "+c1_class+"'>"+
    "<p>"+parameters.manCont_1_id+"</p>"+
    "<div class='container_unit_row'>"+
    "<p>TAMAÑO (FT): "+parameters.manCont_1_size+"</p>"+
    "<p>PESO (TONS): "+parameters.manCont_1_peso+"</p>"+
    "<p>"+parameters.manCont_1_tipo+"</p>"+
    "<p>"+parameters.manCont_1_contenido+"</p>"+
    "</div>"+
    "</div>"+
    "<div class='container_unit "+c2_class+"'>"+
    "<p>"+parameters.manCont_2_id+"</p>"+
    "<div class='container_unit_row'>"+
    "<p>TAMAÑO (FT): "+parameters.manCont_2_size+"</p>"+
    "<p>PESO (TONS): "+parameters.manCont_2_peso+"</p>"+
    "<p>"+parameters.manCont_2_tipo+"</p>"+
    "<p>"+parameters.manCont_2_contenido+"</p>"+
    "</div>"+
    "</div>"+
    "<div class='container_unit "+c3_class+"'>"+
    "<p>"+parameters.manCont_3_id+"</p>"+
    "<div class='container_unit_row'>"+
    "<p>TAMAÑO (FT): "+parameters.manCont_3_size+"</p>"+
    "<p>PESO (TONS): "+parameters.manCont_3_peso+"</p>"+
    "<p>"+parameters.manCont_3_tipo+"</p>"+
    "<p>"+parameters.manCont_3_contenido+"</p>"+
    "</div>"+
    "</div>   "+
    "<div class='container_unit "+c4_class+"''>"+
    "<p>"+parameters.manCont_4_id+"</p>"+
    "<div class='container_unit_row'>"+
    "<p>TAMAÑO (FT): "+parameters.manCont_4_size+"</p>"+
    "<p>PESO (TONS): "+parameters.manCont_4_peso+"</p>"+
    "<p>"+parameters.manCont_4_tipo+"</p>"+
    "<p>"+parameters.manCont_4_contenido+"</p>"+
    "</div>"+
    "</div>"+
    "</div>"+
    "<div class='maneuver_options'>"+
    "<button class='option_btn'>"+
    "<img src='img/ubicacion_white.svg' alt='expand row arrow'>"+
    "</button>"+
    "<button class='option_btn'>"+
    "<img src='img/tracking_white.svg' alt='expand row arrow'>"+
    "</button>"+
    "</div>"+
    "</div>"+
    "</div>"+
    "</div>"
    )
}

//EXPAND MANEUVER ROW...
$('#maneuvuers_scrollableContainer').on('click','.expand_btn', (e)=>
    {
        //$(e.target).closest('.maneuverContainer').find('.detailsRow').toggleClass('hidden')
    
        const $detailsRow = $(e.target).closest('.maneuver_item').find('.collapsable_row')
    
        if ($detailsRow.hasClass('expandable'))
        {
            $detailsRow
            .removeClass('expandable') 
            .css('height', 0) 
            .animate(
                { height: $detailsRow.get(0).scrollHeight },150,
                    function () 
                    {
                        $(this).css('height', '');  
                    }
            );
        }else
        {
            $detailsRow.animate(
                { height: 0 }, 150, 
                function () {
                    $(this).addClass('expandable').css('height', ''); 
                }
            );
        }
    
    })

//#endregion [ LANDING PAGE / MANEUVERS PAGE ]




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

    let search_key_value = $('#moniID_input').val().trim().toUpperCase()

    $.ajax({
        //url: 'http://localhost:8080/man/findManeuver',
        url: 'https://maylob-backend.onrender.com/man/findManeuver',
        type: "get",
        dataType: 'json',
        data:search_key_value,
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

    let search_key_value = $('#moniID_input').val().trim().toUpperCase()

    $('#trackingMap').empty()
    getGPS(search_key_value)
    
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





function getEvents(search_key_value)
{
    //LOADER...!
    $('.toast-loader').css('display','grid').hide().fadeIn(200);
    animationFunction.animateTruck(true)

    $.ajax({
        //url: 'http://localhost:8080/man/findManeuver',
        url: 'https://maylob-backend.onrender.com/man/findManeuver',
        type: "get",
        dataType: 'json',
        data:search_key_value,
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
/*     if (eventPercentage === "0%") 
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
        if (!completed) 
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
        } else 
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
                "<img src='img/inventory_img.svg' alt=''>"+
                "</div>"+
                "<div class=' eventCard-eventInfo green-text'>"+
                eventStatus+
                "</div>"+
                "</div>"+
                "</div>"+
                "<div class='eventCard-color green-bg'></div>"+
                "</div>"+
                "<div class='eventPoint flexCentered '></div>"+
                "<div class='eventPath'></div>"
            )
        }


    }
 */
    

}





//#region    [ AUXILIARY FUNCTIONS ]

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





function display_notification(status,messages)
{
    $('.notify_pop_up').css('display','flex').hide().fadeIn(200)

    $('.notify_text').empty()
    $('.notify_img').empty()

    for (let index = 0; index < messages.length; index++) 
    {
        if (index === 0) 
        {
            $('.notify_text').append('<p class = "notify_strong">'+messages[index]+'</p>')          
        }else
        {
            $('.notify_text').append('<p>'+messages[index]+'</p>')          
        }
    }

    switch (status) 
    {
        case 'ok':
            $('.notify_container').addClass('notify_ok')
            $('.notify_img').append('<img src="img/ok_white.svg" alt="">')
        break;
    
        case 'error':
            $('.notify_container').addClass('notify_error')
            $('.notify_img').append('<img src="img/error_white.svg" alt="">')
        break;

        default:
            $('.notify_container').addClass('notify_warning')
            $('.notify_img').append('<img src="img/warning_white.svg" alt="">')
        break;
    }
}

$('#close_notify').click(function() { $('.notify_pop_up').fadeOut(200) })

//#endregion [ AUXILIARY FUNCTIONS ]