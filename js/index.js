import * as animationFunction from '/js/gsap/indexAnimations.js';

var current_page = ''

// Used for local testing...
//var API_URL = 'http://127.0.0.1:8080'
var API_URL = 'https://maylob-backend.onrender.com'





//#region    [ NAV BAR ]

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
        case 'moniView':
            animationFunction.growAnimation('filter_box',false,'flex')
        break;
    
        default: break;
    }
});

//#endregion [ NAV BAR ]





//#region    [ LANDING PAGE / MANEUVERS PAGE ]

var allManeuvers
var autorefresh
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
                    allManeuvers = data.foundManeuver
                
                    preloadSelectControls(allManeuvers)

                    current_page = animationFunction.navigateToView('search_view','moniView',false,'flex')
                    $('#maneuvuers_scrollableContainer').empty()
                    for (let index = 0; index < data.foundManeuver.length; index++) 
                    {
                        fillDashboard(data.foundManeuver[index])
                    }

                    autorefresh = setInterval(function()
                    {
                        for (let index = 0; index < allManeuvers.length; index++) 
                        {
                            getEvents(allManeuvers[index].man_folio)
                        }
                    },10000
                    )
                    
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
    
/*     let container_1_data = [parameters.manCont_1_id,parameters.manCont_1_size, parameters.manCont_1_peso,parameters.manCont_1_tipo, parameters.manCont_1_contenido]
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
    } */
 
    let containers_assignation_data = [parameters.manCont_1_id,parameters.manCont_2_id, parameters.manCont_3_id,parameters.manCont_4_id]
    let containers_classes          = ["","","",""]
    
    for (let index = 0; index < containers_assignation_data.length; index++) { containers_assignation_data[index] === 'NO ASIGNADO' ? containers_classes[index] = "cu_4" : containers_classes[index] = "cu_1" }

   $('#maneuvuers_scrollableContainer').append(
    "<div class='maneuver_item "+changeMainBG+"'>"+
    "<div class='maneuver_top_row'>"+
    "<table class='maneuver_main_table'>"+
    "<tr>"+
    "<th class='tableData_cntr'>1ER CONTENEDOR</th>"+
    "<th class='tableData_percentage'>%</th>"+
    "<th class='tableData_location'>UBICACIÓN</th>"+
    "<th class='tableData_status'>ESTATUS</th>"+
    "<th class='tableData_mode'>MODALIDAD</th>"+
    "<th class='tableData_dispatch'>F. DESPACHO</th>"+
    "<th class='tableData_finish'>F. TÉRMINO</th>"+
    "</tr>"+
    "<tr>"+
    "<td>"+parameters.manCont_1_id+"</td>"+
    "<td>"+parameters.maneuver_events[parameters.maneuver_events.length-1]+"</td>"+
    "<td>"+parameters.maneuver_current_location+"</td>"+
    "<td>"+parameters.maneuver_current_status+"</td>"+
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
    "<div class='maneuver_details_row'>"+
    "<div class='operative_details_container'>"+
    "<table class='man_general_details'>"+
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
    "<td>"+parameters.man_operador+"</td>"+
    "</tr>"+
    "</table>"+
    "</div>"+
    "<div class='general_details_container'>"+
    "<table class='man_general_details'>"+
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
    "<div class='maneuver_containers'>"+
    "<div class='container_unit "+containers_classes[0]+"'>"+
    "<p>"+parameters.manCont_1_id+"</p>"+
    "<div class='container_unit_row'>"+
    "<p>TAMAÑO (FT) "+parameters.manCont_1_size+"</p>"+
    "<p>PESO (TONS) "+parameters.manCont_1_peso+"</p>"+
    "<p>"+parameters.manCont_1_tipo+"</p>"+
    "<p>"+parameters.manCont_1_contenido+"</p>"+
    "</div>"+
    "</div>"+
    "<div class='container_unit "+containers_classes[1]+"'>"+
    "<p>"+parameters.manCont_2_id+"</p>"+
    "<div class='container_unit_row'>"+
    "<p>TAMAÑO (FT) "+parameters.manCont_2_size+"</p>"+
    "<p>PESO (TONS) "+parameters.manCont_2_peso+"</p>"+
    "<p>"+parameters.manCont_2_tipo+"</p>"+
    "<p>"+parameters.manCont_2_contenido+"</p>"+
    "</div>"+
    "</div>"+
    "<div class='container_unit "+containers_classes[2]+"'>"+
    "<p>"+parameters.manCont_3_id+"</p>"+
    "<div class='container_unit_row'>"+
    "<p>TAMAÑO (FT) "+parameters.manCont_3_size+"</p>"+
    "<p>PESO (TONS) "+parameters.manCont_3_peso+"</p>"+
    "<p>"+parameters.manCont_3_tipo+"</p>"+
    "<p>"+parameters.manCont_3_contenido+"</p>"+
    "</div>"+
    "</div>"+
    "<div class='container_unit "+containers_classes[3]+"'>"+
    "<p>"+parameters.manCont_4_id+"</p>"+
    "<div class='container_unit_row'>"+
    "<p>TAMAÑO (FT) "+parameters.manCont_4_size+"</p>"+
    "<p>PESO (TONS) "+parameters.manCont_4_peso+"</p>"+
    "<p>"+parameters.manCont_4_tipo+"</p>"+
    "<p>"+parameters.manCont_4_contenido+"</p>"+
    "</div>"+
    "</div>"+
    "</div>"+
    "<div class='tracking_container'>"+
    "<div id='timeline_container'>"+
    fillTimeline(parameters)+
    "</div>"+
    "<div class='gps_container'>"+
    "<div class='gps_map'>"+
    "<embed src='"+parameters.man_gpsLink+"'>"+
    "</div>"+
    "</div>"+  
    "</div>"+
    "</div>"+
    "</div>"+
    "</div>"
    )
}

function fillTimeline(maneuver_events)
{
    let tl_content = ''
    let tl_class   = ''

    //FORWARD...
    /* for (let index = 0; index < (maneuver_events.maneuver_events.length / 4); index++) 
    {
        tl_class = index % 2 === 0 ? "left" : "right" 

        tl_content+="<div class='timeline_item "+tl_class+"'>"+
        "<div class='timeline_item_data'>"+
        "<h4>"+maneuver_events.maneuver_events[index*4]+"</h4>"+
        "<P>"+maneuver_events.maneuver_events[index*4+3]+"</P>"+
        "<P>"+maneuver_events.maneuver_events[index*4+1]+"</P>"+
        "<P>"+maneuver_events.maneuver_events[index*4+2]+"</P>"+
        "</div>"+
        "</div>"
    } */

    //BACKWARD...
    for (let index = maneuver_events.maneuver_events.length / 4; index > 0; index--) 
    {
        

        if ((maneuver_events.maneuver_events.length / 4) % 2 === 0) 
        {
            tl_class = index % 2 === 0 ? "left" : "right" 
        } else 
        {
            tl_class = index % 2 === 0 ? "right" : "left" 
        }

        tl_content+="<div class='timeline_item "+tl_class+"'>"+
        "<div class='timeline_item_data'>"+
        "<h4>"+maneuver_events.maneuver_events[index*4 - 4]+"</h4>"+
        "<P>"+maneuver_events.maneuver_events[index*4 - 3]+"</P>"+
        "<P>"+maneuver_events.maneuver_events[index*4 - 1]+"</P>"+
        "<P>"+maneuver_events.maneuver_events[index*4 - 2]+"</P>"+
        "</div>"+
        "</div>"
    }

    return tl_content
}

//Expand MANEUVER ROW...
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


/* +==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+
 * + [⚑] FILTER POP UP...                                                                          +                                                                +
 * +==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+*/ 
// Close FILTER POP-UP...
$('#filter_close').click(function()
{
    switch (current_page) 
    {
        case 'moniView':
            animationFunction.shrinkAnimation('filter_box',false,'none')
        break;
    
        default: break;
    }
});

// Clean FILTER POP-UP...
$('#filter_clear').click(function()
{
    switch (current_page) 
    {
        case 'moniView':
            resetForm('filter_row')
        break;
    
        default: break;
    }
});

// Use filter to re-order maneuvers...
$('#filter_search').click(function()
{
    if(validateField(useFilter(allManeuvers)))
    {
        $('#maneuvuers_scrollableContainer').empty()
        for (let index = 0; index < useFilter(allManeuvers).length; index++) 
        {
            fillDashboard(useFilter(allManeuvers)[index])    
        }
    }else
    {
        $('#maneuvuers_scrollableContainer').empty()
        for (let index = 0; index < allManeuvers.length; index++) 
        {
            fillDashboard(allManeuvers[index]) 
            
            let notification_msg = ['¡No se encontró la maniobra! ⛟ ','* Tal vez no hay ningún dato de búsqueda ingresado.','* Probable dato incorrecto ingresado. Revisa los datos que se ingresaron.']
            display_notification('warning', notification_msg)      
        }
    }

    animationFunction.shrinkAnimation('filter_box',false,'none')
    resetForm('filter_row')

})

function preloadSelectControls(allManeuvers)
{   
    //[1] Find different transporters...
    let transporters = []
    let operators    = [] 

    for (let index = 0; index < allManeuvers.length; index++) 
    {
        transporters.push(allManeuvers[index].man_transportista)
        operators.push(allManeuvers[index].man_operador)
    }

    let filtered_transporters = [...new Set(transporters)]
    let filtered_operators    = [...new Set(operators)]
    
    //[2] Start filling controls...
    $('#transportista_filter').empty()
    $('#transportista_filter').append("<option value=''>SELECCIONA</option>")
    for (let index = 0; index < filtered_transporters.length; index++) 
    {
        $('#transportista_filter').append(
            "<option value='"+filtered_transporters[index]+"'>"+filtered_transporters[index]+"</option>"
        )
    } 
    
    $('#operador_filter').empty()
    $('#operador_filter').append("<option value=''>SELECCIONA</option>")
    for (let index = 0; index < filtered_operators.length; index++) 
    {
        $('#operador_filter').append(
            "<option value='"+filtered_operators[index]+"'>"+filtered_operators[index]+"</option>"
        )
    } 

}

function useFilter(allManeuvers)
{
    /* [1]
    *  Get all used filter values...
    */

    const availableFilters  = ['contedores_filter','transportista_filter','operador_filter','placas_filter','from_date_filter','until_date_filter','finished_filter']
    let usedFilters         = []
    let filteredMAneuvers   = []

    for (let index = 0; index < availableFilters.length; index++) 
    {
        if (index != 6 ) 
        {
            validateField($('#'+availableFilters[index]).val()) ? 
            usedFilters.push($('#'+availableFilters[index]).val())
            :
            usedFilters.push('0')
        }else
        {
            $('#'+availableFilters[index]).is(":checked") ?
            usedFilters.push($('#'+availableFilters[index]).val())
            :
            usedFilters.push('0')
        }
    }
    console.log(usedFilters);
    /* - Step[2]  
    *  - Start filtering to return new array... 
    */

    //Search only by CONTAINERS ID...
    let containersID_search
    if (usedFilters[0] != '0') 
    {
        containersID_search = usedFilters[0].split(",")
        containersID_search = containersID_search.filter(nonEmpty => nonEmpty !=="")
        console.log(containersID_search);
        for (let i = 0; i < containersID_search.length; i++) 
        {
            for (let index = 0; index < allManeuvers.length; index++) 
            {
                if (containersID_search[i] === allManeuvers[index].manCont_1_id || containersID_search[i] === allManeuvers[index].manCont_2_id || containersID_search[i] === allManeuvers[index].manCont_3_id || containersID_search[i] === allManeuvers[index].manCont_4_id) filteredMAneuvers.push(allManeuvers[index])
            }
        }
        if (filteredMAneuvers.length > 0) return filteredMAneuvers
    }

    //Search only by TRANSPORTER...
    if (usedFilters[1] != '0') 
    {   
        for (let index = 0; index < allManeuvers.length; index++) 
        {
            if (usedFilters[1] === allManeuvers[index].man_transportista) filteredMAneuvers.push(allManeuvers[index])
        }
        
        if (filteredMAneuvers.length > 0) return filteredMAneuvers
    }

    //Search only by OPERATOR...
    if (usedFilters[2] != '0') 
    {   
        for (let index = 0; index < allManeuvers.length; index++) 
        {
            if (usedFilters[2] === allManeuvers[index].man_operador) filteredMAneuvers.push(allManeuvers[index])
        }
        
        if (filteredMAneuvers.length > 0) return filteredMAneuvers
    }

    //Search only by PLATES...
    if (usedFilters[3] != '0') 
    {
        for (let index = 0; index < allManeuvers.length; index++) 
        {
            if (usedFilters[3] === allManeuvers[index].man_placas) filteredMAneuvers.push(allManeuvers[index])
        }
    
        if (filteredMAneuvers.length > 0) return filteredMAneuvers
    }

    //Search only between two dates...
    if (usedFilters[4] != '0') 
    {  
        let date_from = new Date(usedFilters[4]);

        if (usedFilters[5] != '0') 
        {   
            let date_to = new Date(usedFilters[5]);
            for (let index = 0; index < allManeuvers.length; index++) 
            {
                let date_to_check = new Date (allManeuvers[index].man_despacho)
                if ( date_to_check >= date_from && date_to_check <= date_to) filteredMAneuvers.push(allManeuvers[index])
            }
        }else
        {
            for (let index = 0; index < allManeuvers.length; index++) 
            {
                let date_to_check = new Date (allManeuvers[index].man_despacho)
                if (date_to_check >= date_from) filteredMAneuvers.push(allManeuvers[index])
            }
        }
        
        if (filteredMAneuvers.length > 0) return filteredMAneuvers
    }

    //Search only maneuvers with 100% COMPLETION...
    if (usedFilters[6] != '0') 
    {  
        for (let index = 0; index < allManeuvers.length; index++) 
        {
            if ('FINALIZADO' === allManeuvers[index].maneuver_current_status) filteredMAneuvers.push(allManeuvers[index])
        }
        
        if (filteredMAneuvers.length > 0) return filteredMAneuvers
    }

}

function getEvents(maneuver2search)
{

    $.ajax({
        url: API_URL+'/man/findManeuver',
        type: "get",
        dataType: 'json',
        data:maneuver2search,
        success : (function (data) 
        {
            console.log(data);
            if (data.message != '0') 
            {
                let foundEvents = data.foundManeuver[0]
                console.log(foundEvents);

                $('#timeline_container').empty()
                $('#timeline_container').append(fillTimeline(foundEvents))

            }              
        }),

        error:function()
        {
            console.log('No hay respuesta de sevidor');
        }

        //async:false
    })
}

//#endregion [ LANDING PAGE / MANEUVERS PAGE ]





/**
 * +==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+
 * +                                                                                               +
 * + [⚑] AUXILIARY FUCTIONS...                                                                     +
 * +                                                                                               +
 * +==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+==+
 */ 
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





function resetForm(formClass) { $("."+formClass+"").find(':input').val('') }





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