$(document).ready(function(){
	// alert("Probar JQuery!");
	var height = $(window).height();
	$('#viewDiv').height(height-76);
	cambiarTabs();
	loadEmpresas("TODOS", false); //SE CARGAN TODAS LAS EMPRESAS EN EL SELECT
	loadCausas("TODOS");
	localStorage.setItem('nombre', 'Juan');
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
function loadEmpresas(select, causas) {
	console.log("causas -> "+causas);
	var servicio = select;
	var url = "http://localhost:5055/empresa/"+servicio;

	console.log(url);
	
	$.ajax({
		type: "GET",
		url: url,
		success: function(response){
			// console.log(response);

			$('#inputGroupSelect03') //SI TIENE ITEMS SE ELIMINAN
				.find('option')
				.remove();

			$('#inputGroupSelect03').append('<option value=[{"cod_empresa":0,"servicio":"TODOS"}] selected="selected">TODAS</option>');
			
			$.each(response, function (i, item) { //CARGA LOS ITEMS EN EL SELECT
				var arreglo_empresa = [];
				var json_empresa;
				var obj = new Object(); //nuevo objeto siempre que entre al for
				obj.cod_empresa = item.cod_empresa;
				obj.servicio = item.servicio;
				
				arreglo_empresa.push(obj);
				json_empresa = JSON.stringify(arreglo_empresa); //Convertimos el arreglo a formato json
				
				//console.log(json_empresa);
				$('#inputGroupSelect03').append($('<option>', { 
					value: json_empresa,
					text : item.nombre + " | " + item.cod_empresa
				}));
			});
		}
	});
	// cuando se seleccione la empresa cambia partiendo de sus codigos de causal
	if (causas) {
		loadCausas(servicio);	
	}
}

/*FUNCION QUE CARGA LOS ITEMS EN EL SELECT DE CAUSAS PARTIENDO DE LA OPCION SELECCIONADA EN EL SELECT EMPRESAS*/
function loadCausas(select) { // el select recibe un json con el codigo de empresa y el servicio
	console.log("causas -> "+select);
	var ano = $("#inputGroupSelect0").val();
	var mes = $("#inputGroupSelect01").val();
	 
	var cod_empresa;
	var servicio = "";

	if (select == "TODOS" || select == "energia" || select == "gas" || select == "glp") { 
		cod_empresa = 0;
		servicio = select;
	}else{ // se ejecuta cuando se le envia el parametro por medio del select de empresas
		var datos_empresa = JSON.parse(select);
		$.each(datos_empresa, function (i, item) {
			cod_empresa = item.cod_empresa;
			servicio = item.servicio;
		});
		if (servicio == "TODOS") {
			servicio = $("#inputGroupSelect02").val();
		}
	}

	// var url = "http://localhost:5055/causas/"+cod_empresa+"/"+servicio+"/"+ano+"/"+mes //url con filtros
	var url = "http://localhost:5055/causas/"+servicio
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
					text : item.descripcion + " | " + item.servicio + " | " + item.cod_causa
				}));
			});
		},
		error: function(error) { console.log('Failed!' + error); }
	});
}