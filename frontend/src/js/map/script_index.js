$(document).ready(function(){
	// alert("Probar JQuery!");
	var height = $(window).height();
	$('#viewDiv').height(height-76);
	cambiarTabs();
	loadEmpresas("TODOS"); //SE CARGAN TODAS LAS EMPRESAS EN EL SELECT
	loadCausas(0);	
});

/*CAMBIAR TABS*/
function cambiarTabs() {	
	$('#myTab a').on('click', function (e) {
		e.preventDefault();
		$(this).tab('show');
	})	
}

// Funcion que permite cerrar la ventana que aparece mientras se cargan los puntos
function closeLoad(){
	// $('#fbdrag1').fadeOut().prev().fadeOut();
	$('.fb').hide();
	$('.fbback').hide();
	$('body').css('overflow','auto');
}

// Funcion que muestra la ventana de carga
function showLoad(){
	$('.fb').show();
	$('.fbback').show();
	$('body').css('overflow','hidden');
}

/*OCULTA EL DIV OSCURO QUE APARECE CUANDO CARGAN DATOS EN EL DIV DEL MAPA*/
function showBackdrop(backdrop){
	// console.log(backdrop);
	if (backdrop) {
		$('.fbback_map').show();
		backdrop = false;
	}else{
		$('.fbback_map').hide();
		backdrop = true;
	}
}

/*FUNCION QUE SE EJECUTA CUANDO SE DA CLICK AL DIV OSCURO DE CARGA - SI SE DA CLICK SOBRE ESTE SE OCULTA*/
function watchBackdrop(){
	if ($('.fbback_map').is(":visible")) {
		$('.collapse').collapse('hide');
		$('.fbback_map').hide();
		$("#butonOpcion").html("Opciones PQR's&nbsp&nbsp<i class='fa fa-angle-double-down' data-toggle='collapse' data-target='#collapseExample'></i>");
	}else{
		$("#butonOpcion").html("Opciones PQR's&nbsp&nbsp<i class='fa fa-angle-double-up' data-toggle='collapse' data-target='#collapseExample'></i>");
		$('.fbback_map').show();
	}
}

/*FUNCION QUE CARGA LOS ITEMS EN EL SELECT DE EMPRESAS PARTIENDO DE LA OPCION SELECCIONADA EN EL SELECT SERVICIO*/
function loadEmpresas(select) {
	console.log(select);
	
	$.ajax({
		type: "GET",
		url: "http://localhost:5055/empresa/"+select,
		success: function(response){
			// console.log(response);

			$('#inputGroupSelect03') //SI TIENE ITEMS SE ELIMINAN
				.find('option')
				.remove();

			$('#inputGroupSelect03').append('<option value=0 selected="selected">TODAS</option>');
			
			$.each(response, function (i, item) { //CARGA LOS ITEMS EN EL SELECT
				$('#inputGroupSelect03').append($('<option>', { 
					value: item.cod_empresa,
					text : item.nombre
				}));
			});
		}
	});
}

/*FUNCION QUE CARGA LOS ITEMS EN EL SELECT DE CAUSAS PARTIENDO DE LA OPCION SELECCIONADA EN EL SELECT EMPRESAS*/
function loadCausas(select) {
	console.log(select);
	var ano = $("#inputGroupSelect0").val();
	var mes = $("#inputGroupSelect01").val();
	var servicio = $("#inputGroupSelect02").val();
	var cod_empresa = select;
	var url = "http://localhost:5055/causas/"+cod_empresa+"/"+servicio+"/"+ano+"/"+mes
	console.log("URL CAUSAS -> " + url);
	$.ajax({
		url: url,
		type: 'GET',
		success: function(response){
			console.log(response);

			$('#inputGroupSelect04') //SI TIENE ITEMS SE ELIMINAN
				.find('option')
				.remove();

			$('#inputGroupSelect04').append('<option value=0 selected="selected">TODAS</option>');
			
			$.each(response, function (i, item) { //CARGA LOS ITEMS EN EL SELECT
				$('#inputGroupSelect04').append($('<option>', { 
					value: item.cod_causa,
					text : item.descripcion
				}));
			});
		},
		error: function(error) { console.log('Failed!' + error); }
	});
}