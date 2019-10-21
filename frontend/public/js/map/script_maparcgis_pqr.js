// CUANDO SE AÑADA LA FUNCIONALIDAD DE LA TABLA 2 Y 3 AÑADIR UN NUEVO PARAMETRO (OPCION) A LA FUNCION VISUALIZAR PARA QUE SE PUEDA LLAMAR LA FUNCIONALIDAD CORRESPONDIENTE 
// REVISAR LA EMPRESA DE GLP INVERSIONES GLP SAS ESP NO APRECE EN LISTADO DE EMPRESAS
// COLGAS DE OCCIDENTE SA ESP
// QUE AL SELECCIONAR UN MUNICIPIO SE HAGA UN ZOOM EN EL MAPA
function visualizar(opcion, datos) { //toca colocar opciones {opcionbody, opcionform(undefined), opcionboton }
  $('#table_pqrs_causas').hide();
  var ano = $("#inputGroupSelect0").val();
  var mes = $("#inputGroupSelect01").val();
  var servicio = $("#inputGroupSelect02").val();
  var datos_empresa = JSON.parse($("#inputGroupSelect03").val());
  var cod_causa = $("#inputGroupSelect04").val();
  var empresa = $("#inputGroupSelect03 option:selected").text();
  var meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

  var cod_empresa;
  var lat;
  var long;
  var coordenadas;
  var zoom;

  localStorage.setItem('servicioAntes', servicio);

	if (opcion == 'opc1') {     
    console.log("FUNCIÓN VISUALIZAR EJECUTADA DESDE EL BODY");
		cod_empresa = 0;
    localStorage.setItem('empresaAntes', cod_empresa);
    servicio = "TODOS";
  }else if (opcion == 'opc2') { // se ejecuta cuando se le envia el parametro por medio del select de empresas
    console.log("FUNCIÓN VISUALIZAR EJECUTADA DESDE EL FORM (OPCIONES HEADER)");
		$.each(datos_empresa, function (i, item) {
			cod_empresa = item.cod_empresa;
			servicioJSON = item.servicio;
    });
    console.log("servicio JSON -> "+servicioJSON);
    let servicioAntes = localStorage.getItem('servicioAntes');
    $('#inputGroupSelect02 option[value="'+servicioAntes+'"]').removeAttr("selected");
	  localStorage.setItem('servicioAntes', servicioJSON);
    $('#inputGroupSelect02 option[value="'+servicioJSON+'"]').attr('selected', 'selected'); // cambia el valor del select

    let empresaAntes = localStorage.getItem('empresaAntes');
    $("#inputGroupSelect03 option[value='[{\"cod_empresa\":"+empresaAntes+",\"servicio\":\""+servicioAntes+"\"}]']").removeAttr("selected");
    console.log("#inputGroupSelect03 option[value='[{\"cod_empresa\":"+empresaAntes+",\"servicio\":\""+servicioAntes+"\"}]']");  
    localStorage.setItem('empresaAntes', cod_empresa);
    // loadEmpresas(servicioJSON, true, cod_empresa);
    servicio = servicioJSON;
  }else if (opcion == 'opc3') {    
    console.log("FUNCIÓN VISUALIZAR EJECUTADA DESDE EL ICONO DE LA TABLA EMPRESAS");
    $.each(JSON.parse(datos), function (i, item) {
      cod_empresa = item.cod_empresa;
      cod_causa = item.cod_causa;
			servicioJSON = item.servicio;
    });    
    let servicioAntes = localStorage.getItem('servicioAntes');
    $('#inputGroupSelect02 option[value="'+servicioAntes+'"]').removeAttr("selected");
	  localStorage.setItem('servicioAntes', servicioJSON);
    $('#inputGroupSelect02 option[value="'+servicioJSON+'"]').attr('selected', 'selected'); // cambia el valor del select

    let empresaAntes = localStorage.getItem('empresaAntes');
    console.log("empresa antes -> "+empresaAntes);
    var arreglo_empresa = [];
    var json_empresa;
    var obj = new Object(); //nuevo objeto siempre que entre al for
    obj.cod_empresa = parseInt(empresaAntes);
    obj.servicio = servicioAntes;
    
    arreglo_empresa.push(obj);    
    json_empresa = JSON.stringify(arreglo_empresa); //Convertimos el arreglo a formato json

    // $('#inputGroupSelect03 option[value="'+JSON.parse(json_empresa)+'"]').removeAttr("selected");
    // console.log('#inputGroupSelect03 option[value="'+json_empresa+'"]');

    // $("#inputGroupSelect03 option[value='[{\"cod_empresa\":0,\"servicio\":\"TODOS\"}]']").removeAttr("selected");
    
    $("#inputGroupSelect03 option[value='[{\"cod_empresa\":"+empresaAntes+",\"servicio\":\""+servicioAntes+"\"}]']").removeAttr("selected");
    console.log("#inputGroupSelect03 option[value='[{\"cod_empresa\":"+empresaAntes+",\"servicio\":\""+servicioAntes+"\"}]']");  
    localStorage.setItem('empresaAntes', cod_empresa);
    loadEmpresas(servicioJSON, true, cod_empresa);
    // $("#inputGroupSelect03 option[value='[{\"cod_empresa\":"+cod_empresa+",\"servicio\":\""+servicioJSON.toUpperCase()+"\"}]']").attr('selected', 'selected'); // cambia el valor del select    
    // console.log("#inputGroupSelect03 option[value='[{\"cod_empresa\":"+cod_empresa+",\"servicio\":\""+servicioJSON.toUpperCase()+"\"}]']");
    servicio = servicioJSON;
  }else if (opcion == 'opc4') {
    console.log("FUNCIÓN VISUALIZAR EJECUTADA DESDE EL ICONO DE LA TABLA CAUSAS");
    $.each(JSON.parse(datos), function (i, item) {
      cod_causa = item.cod_causa;      
      cod_empresa = item.cod_empresa;
    });
  }

  console.log("OPCIÓN SELECCIONADA -> " + opcion);
  // console.log(ano);
  // console.log(mes);
  console.log("SERVICIO SELECCIONADO -> " + servicio);
  // console.log(cod_empresa);
  // console.log("NOMBRE EMPRESA SELECCIONADA -> " + empresa);
  // console.log("CAUSA SELECCIONADA -> " + cod_causa);
  // console.log("CODIGO EMPRESA SELECCIONADO -> " + cod_empresa);

  require(
    [
      "esri/Map",
      "esri/layers/CSVLayer",
      "esri/views/MapView",
      "esri/widgets/Legend",
      "esri/widgets/Search",
      "esri/core/watchUtils",
      "esri/widgets/BasemapToggle",
      "esri/views/View"
    ],
    function(Map, CSVLayer, MapView, Legend, Search, watchUtils, BasemapToggle, View) {
      const url =
                  // "http://172.16.128.141:5055/pqr/cod_empresa/2249/energia/2018";
                  // "http://localhost:5055/pqr/empresa/0/glp/2018/1/0";
                  "http://localhost:5055/pqr/empresa"+"/"+cod_empresa+"/"+servicio+"/"+ano+"/"+mes+"/"+cod_causa;

      // console.log("URL PQR's -> " + url);

      urlPqrsCausas = "http://localhost:5055/pqr_causas"+"/"+cod_empresa+"/"+servicio+"/"+ano+"/"+mes+"/"+cod_causa;

      // console.log("URL PQR's CAUSAS -> "+urlPqrsCausas);

      $('#table_pqrs_causas tbody').empty();
      $('#transfer1').css("display", "block");
      $.ajax({
        type: "GET",
        url: urlPqrsCausas,        
        success: function(data){
          $('#transfer1').css("display", "none");
          // console.log("SE GENERA JSON PQR´s CAUSAS");
          // console.log(data);
          $.each(data, function(i, item) {
            $tr = $('<tr>').append(
              $('<td>').html(item.servicio),
              $('<td>').text(item.desc_causa),
              $('<td>').text(item.numero_pqrs),
              $('<td>').html('<a href="javascript:visualizar(\'opc4\',JSON.stringify([{\'cod_empresa\':'+cod_empresa+',\'cod_causa\':\''+item.cod_causa+'\'}]))" style="color: black;"><i class="fa fa-external-link" alt="tooltip"></i></a>')    
            ).appendTo('#table_pqrs_causas tbody');            
          });
          $('#table_pqrs_causas').show();
        }
      });

      d3.csv(url, function(data){        
        let servicioEmpresa;
        if (data.length > 1) {
          // console.log("SE GENERA JSON PQR´s");
          console.log(data);
          $('#table_pqrs tbody').empty();
          $.each(JSON.parse(JSON.stringify(data)), function(i, item) {
            if (item.servicio != "") {
              if ((opcion == "opc1" && servicio == "TODOS") || 
                  (opcion == "opc2" && servicio == "TODOS") ||
                  (opcion == "opc2" && empresa == "TODAS") ||
                  (opcion == "opc4" && servicio == "TODOS") ||
                  (opcion == "opc4" && empresa == "TODAS")) {
                $tr = $('<tr>').append(
                  $('<td>').html(item.empresa),
                  $('<td>').text(item.centro_poblado),
                  $('<td>').text(item.numero_pqrs),
                  $('<td>').html('<a href="javascript:visualizar(\'opc3\',JSON.stringify([{\'cod_empresa\':'+item.cod_empresa+',\'servicio\':\''+item.servicio.toLowerCase()+'\',\'cod_causa\':\''+cod_causa+'\'}]))" style="color: black;"><i class="fa fa-external-link" alt="tooltip"></i></a>')
                ).appendTo('#table_pqrs tbody');
              }else{
                $tr = $('<tr>').append(                    
                  $('<td>').html(item.empresa),
                  $('<td>').text(item.centro_poblado),
                  $('<td>').text(item.numero_pqrs)
                ).appendTo('#table_pqrs tbody');
                // servicioEmpresa = item.servicio;
                // localStorage.setItem('servicio', servicioEmpresa);
                // console.log("servico antes de borrar -> " + servicio);
                // $('#inputGroupSelect02 option[value="'+servicio+'"]').removeAttr("selected");
                // // $('#inputGroupSelect02 option[value="energia"]').removeAttr("selected");
                // // $('#inputGroupSelect02 option[value="gas"]').removeAttr("selected");
                // // $('#inputGroupSelect02 option[value="glp"]').removeAttr("selected");
                // // console.log("borro el selected!");
                // $('#inputGroupSelect02 option[value="'+servicioEmpresa.toLowerCase()+'"]').attr('selected', 'selected'); // cambia el valor del select
                // $('#inputGroupSelect03 option[value="[{\'cod_empresa\':\''+item.cod_empresa+'servicio\':\''+servicioEmpresa.toLowerCase()+'\'}]"]').attr('selected', 'selected');
              }            
            }
            if (item.latitude != undefined) {
              // localStorage.setItem('latitud', item.latitude);
              // localStorage.setItem('longitud', item.longitude);
            }                       
          });
          
          // let servicioSave = localStorage.getItem('servicio');
          // if (servicioSave != null) {
          //   loadEmpresas(servicioSave.toLowerCase(), true);
          // }            
          if (servicio == "TODOS") {
            $('#label_empresa').html("TOP MAYOR NÚMERO DE PQR's | "+servicio.toUpperCase()).show()
          }else{
            $('#label_empresa').html("TOP MAYOR NÚMERO DE PQR's")
          }
          $('#table_pqrs').show();
          // console.log("valor del select servicio -> "+$("#inputGroupSelect02").val());
        }else{
          console.log("NO SE GENERO JSON DE PQR's");
          $('#table_pqrs tbody').empty();
          Swal.fire({
            type: 'info',
            title: 'Oops...',
            text: 'El prestador no tiene PQR\'s para este período.',
          })
        }        
      });
      

      // Paste the url into a browser's address bar to download and view the attributes
      // in the CSV file. These attributes include:
      // * mag - magnitude
      // * type - earthquake or other event such as nuclear test
      // * place - location of the event
      // * time - the time of the event

      const template = {
        title: "<b>EMPRESA:</b> {empresa} <br><b>Cantidad de PQR's:</b> {numero_pqrs}",
        content: "<!DOCTYPE html>"+
        "<html lang='es' dir='ltr'>"+
          "<head>"+
            "<meta charset='utf-8'>"+
            "<title></title>"+
          "</head>"+
          "<body>"+
            "<br> <b>MUNICIPIO:</b> {centro_poblado}"+
          "</body>"+
        "</html>"
      };

      // The heatmap renderer assigns each pixel in the view with
      // an intensity value. The ratio of that intensity value
      // to the maxPixel intensity is used to assign a color
      // from the continuous color ramp in the colorStops property

      const renderer = {
        type: "heatmap",
        field: "numero_pqrs",
        colorStops: [
          { color: "rgba(63, 40, 102, 0)", ratio: 0 }, //rango de 0 a 1
          { color: "#6300df", ratio: 0.083 }, // Azul claro
          { color: "#002dfe", ratio: 0.100 }, // Azul
          { color: "#00ff2c", ratio: 0.166 }, // Verde Clarito
          { color: "#a1ff00", ratio: 0.249 }, // Verde
          { color: "#e5ff00", ratio: 0.332 }, //Amarillo claro
          { color: "#fef700", ratio: 0.415 }, // Amarillo
          { color: "#ffc700", ratio: 0.498 }, // Amarillo oscuro
          { color: "#fea701", ratio: 0.581 }, // Naranja claro
          { color: "#ff6400", ratio: 0.664 }, // Naranja
          { color: "#ff3000", ratio: 1 }      // Rojo
        ],
        maxPixelIntensity: 2000,
        minPixelIntensity: 50
      };

      function getTitle() {
        if (servicio != "TODOS" && cod_empresa != 0 && mes != 0) {
          title = "PQR´s "+servicio.toUpperCase()+" - "+empresa+" - "+meses[mes-1]+" DE "+ano;
        }else if (servicio != "TODOS" && cod_empresa != 0 && mes == 0) {
          title = "PQR´s "+servicio.toUpperCase()+" - "+empresa+" - "+ano;        
        }else if (servicio != "TODOS" && cod_empresa == 0 && mes != 0) {
          title = "PQR´s "+servicio.toUpperCase()+" - "+meses[mes-1]+" DE "+ano;
        }else if (servicio != "TODOS" && cod_empresa == 0 && mes == 0) {
          title = "PQR´s "+servicio.toUpperCase()+" - "+ano;
        
        }else if (servicio == "TODOS" && cod_empresa != 0 && mes != 0) {
          title = "PQR´s - "+empresa+" - "+meses[mes-1]+" DE "+ano;
        }else if (servicio == "TODOS" && cod_empresa != 0 && mes == 0) {
          title = "PQR´s - "+empresa+" - "+ano;     
        }else if (servicio == "TODOS" && cod_empresa == 0 && mes != 0) {
          title = "PQR´s - "+meses[mes-1]+" DE "+ano;
        }else if (servicio == "TODOS" && cod_empresa == 0 && mes == 0) {
          title = "PQR´s "+" - "+ano;       
        } else {
          title = "else";
          console.log("-> else");
        }
        return title;
      }

      const layer = new CSVLayer({
        url: url,
        title: getTitle(),
        copyright: "DESARROLLADO POR JUAN CAMILO HERRERA - CONTRATISTA SSPD",
        popupTemplate: template,
        renderer: renderer
      });      

      const map = new Map({
        basemap: "streets",
        layers: [layer],
        // ground: "world-elevation"
      });

      if (opcion == 'opc3'){
        lat = localStorage.getItem('latitud');
        long = localStorage.getItem('longitud');
        // coordenadas = [long, lat];
        coordenadas = [-75.47106040285713, 6.007862882142857];
        zoom = 6;
        // console.log(coordenadas);
      } else
      {
        // console.log("no entro al if!");
        coordenadas = [-75.47106040285713, 6.007862882142857];
        zoom = 6;
      }

      const view = new MapView({
        container: "viewDiv",
        center: coordenadas, // [horizontal (long), vertical (lat)]
        zoom: zoom,
        map: map
      });
      
      // Display the loading indicator when the view is updating
      watchUtils.whenTrue(view, "updating", function(evt) {
        showLoad();
      });

      // Hide the loading indicator when the view stops updating
      watchUtils.whenFalse(view, "updating", function(evt) {
        showBackdrop(false);
        closeLoad();
        $(".collapse").collapse("hide");
        $("#butonOpcion").html("Opciones PQR's&nbsp&nbsp<i class='fa fa-angle-double-down' data-toggle='collapse' data-target='#collapseExample'></i>");
      });
      
      var legend = new Legend({view: view});
      var search = new Search({view: view});
      var basemapToggle = new BasemapToggle({view: view, nextBasemap: "gray"});

      view.ui.add(legend, "bottom-right"); // MUESTRA LAS CONVENCIONES DEL MAPA
      view.ui.add(search, "top-right"); // MUESTRA EL INPUT DE BUSQUEDA
      view.ui.add(basemapToggle, "top-right"); // MUESTRA LAS OPCIONES DEL MAPA BASE
      view.ui.move([ "zoom", basemapToggle ], "top-right"); // MOVER LOS BOTONES DE ZOOM A LA DERECHA
    }
  );
}