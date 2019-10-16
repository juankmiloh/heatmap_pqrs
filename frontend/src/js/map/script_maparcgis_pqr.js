// CUANDO SE AÑADA LA FUNCIONALIDAD DE LA TABLA 2 Y 3 AÑADIR UN NUEVO PARAMETRO (OPCION) A LA FUNCION VISUALIZAR PARA QUE SE PUEDA LLAMAR LA FUNCIONALIDAD CORRESPONDIENTE 
// REVISAR LA EMPRESA DE GLP INVERSIONES GLP SAS ESP NO APRECE EN LISTADO DE EMPRESAS
// COLGAS DE OCCIDENTE SA ESP
// QUE AL SELECCIONAR UN MUNICIPIO SE HAGA UN ZOOM EN EL MAPA
function visualizar(opcion, datos) { //toca colocar opciones {opcionbody, opcionform(undefined), opcionboton }
  var ano = $("#inputGroupSelect0").val();
  var mes = $("#inputGroupSelect01").val();
  var servicio = $("#inputGroupSelect02").val();
  var datos_empresa = JSON.parse($("#inputGroupSelect03").val());
  var cod_causa = $("#inputGroupSelect04").val();
  var empresa = $("#inputGroupSelect03 option:selected").text();
  var meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

  var cod_empresa;

  console.log("opcion seleccionada -> "+opcion);
  // console.log(ano);
  // console.log(mes);
  console.log("servicio -> " + servicio);
  // console.log(cod_empresa);
  console.log("valor empresa -> "+empresa);

	if (opcion == 'opc1') {     
    console.log("funcion llamada desde el body!");
		cod_empresa = 0;
    // servicio = "TODOS";
  }else if (opcion == 'opc2') { // se ejecuta cuando se le envia el parametro por medio del select de empresas
    console.log("funcion llamada desde el form!");
    // console.log("entro al JSON!");
		$.each(datos_empresa, function (i, item) {
			cod_empresa = item.cod_empresa;
			// servicio = item.servicio;
    });
    $("#inputGroupSelect02 option:selected").removeAttr("selected");
    $('#inputGroupSelect02 option[value="'+servicio+'"]').attr('selected', 'selected');
    // $('#inputGroupSelect02 option[value="'+servicio+'"]').attr('selected', false);
  }else if (opcion == 'opc3') {
    console.log("funcion llamada desde el boton!");
    $.each(JSON.parse(datos), function (i, item) {
			cod_empresa = item.cod_empresa;
			// servicio = item.servicio;
    });
	}

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

      console.log("URL PQR's -> "+url);

      var countries = [];
      function unselect() {
        $.each($(".car option:selected"), function () {
          countries.push($(this).val());
          $(this).prop('selected', false); // <-- HERE
        });
      }      

      urlPqrsCausas = "http://localhost:5055/pqr_causas"+"/"+cod_empresa+"/"+servicio+"/"+ano+"/"+mes+"/"+cod_causa;

      console.log("URL PQR's CAUSAS -> "+urlPqrsCausas);

      datos = {};
      $.getJSON(urlPqrsCausas, datos, function(response){
        console.log(response);
        $.each(response, function(i, item) {
          // console.log(item.servicio);
          $tr = $('<tr>').append(
            $('<td>').html(item.servicio),            
            $('<td>').text(item.desc_causa),
            $('<td>').text(item.numero_pqrs),
            $('<td>').html('<a href="javascript:visualizar(\'opc3\',JSON.stringify([{\'cod_empresa\':'+item.cod_empresa+',\'servicio\':\''+servicio+'\'}]))" style="color: black;"><i class="fa fa-external-link" alt="tooltip"></i></a>')
          ).appendTo('#table_pqrs_causas tbody');
        });
      });

      d3.csv(url, function(data){
        d3.csv(url, function(data){
          console.log(data);
          let servicioEmpresa;
          if (data.length > 1) {
            console.log("tiene datos!");
            $('#table_pqrs tbody').empty();
            $.each(JSON.parse(JSON.stringify(data)), function(i, item) {
              if (item.servicio != "") {
                if ((opcion == "opc1" && servicio == "TODOS") || 
                    (opcion == "opc2" && servicio == "TODOS") ||
                    (opcion == "opc2" && empresa == "TODAS")) {
                  // console.log("funcion de opcion -> "+opcion);
                  $tr = $('<tr>').append(
                    // $('<td>').html('<img src="./image/eh.ico" alt="">'),
                    $('<td>').html(item.empresa),
                    $('<td>').text(item.centro_poblado),
                    $('<td>').text(item.numero_pqrs),
                    $('<td>').html('<a href="javascript:visualizar(\'opc3\',JSON.stringify([{\'cod_empresa\':'+item.cod_empresa+',\'servicio\':\''+servicio+'\'}]))" style="color: black;"><i class="fa fa-external-link" alt="tooltip"></i></a>')
                  ).appendTo('#table_pqrs tbody');
                }else{
                  $tr = $('<tr>').append(                    
                    $('<td>').html(item.empresa),
                    $('<td>').text(item.centro_poblado),
                    $('<td>').text(item.numero_pqrs)
                  ).appendTo('#table_pqrs tbody');
                  servicioEmpresa = item.servicio;
                  localStorage.setItem('servicio', servicioEmpresa);
                  console.log("probando servicio minuscula -> "+servicioEmpresa.toLowerCase());                  
                  // $("#inputGroupSelect02 option:selected").prop("selected", false);
                  $("#inputGroupSelect02 option:selected").removeAttr("selected");
                  // $("#inputGroupSelect02").attr('selectedIndex', '-1');
                  // $("#inputGroupSelect02").attr('selectedIndex', '-1').find("option:selected").removeAttr("selected");
                  // $("#inputGroupSelect02")[0].selectedIndex = -1;
                  // $('#inputGroupSelect02').val(0);
                  // $('#inputGroupSelect02').attr('selectedIndex', 0);
                  // $('#inputGroupSelect02 option[value="'+servicio+'"]').attr('selected', false);
                  $('#inputGroupSelect02 option[value="'+servicioEmpresa.toLowerCase()+'"]').attr('selected', 'selected');
                  // $("._statusDDL").val(2).change();
                  $('#inputGroupSelect03 option[value="[{\'cod_empresa\':\''+item.cod_empresa+'servicio\':\''+servicioEmpresa.toLowerCase()+'\'}]"]').attr('selected', 'selected');
                }            
              }
            });
            let servicioSave = localStorage.getItem('servicio');
            if (servicioSave != null) {
              loadEmpresas(servicioSave.toLowerCase(), true); 
            }            
            if (servicio == "TODOS") {
              $('#label_empresa').html("TOP MAYOR NÚMERO DE PQR's | "+servicio.toUpperCase()).show()
            }else{
              $('#label_empresa').html("TOP MAYOR NÚMERO DE PQR's")
            }
            $('#table_pqrs').show('slow'); 
            console.log("valor del select servicio -> "+$("#inputGroupSelect02").val());
          }else{
            console.log("no hay datos!");
            $('#table_pqrs tbody').empty();
            Swal.fire({
              type: 'info',
              title: 'Oops...',
              text: 'El prestador no tiene PQR\'s para este período.',              
            })
          }        
        });
      });
      

      // Paste the url into a browser's address bar to download and view the attributes
      // in the CSV file. These attributes include:
      // * mag - magnitude
      // * type - earthquake or other event such as nuclear test
      // * place - location of the event
      // * time - the time of the event

      const template = {
        title: "<b>EMPRESA:</b> {empresa} <br><b>Cantidad de PQR's:</b> {numero_pqrs}", //colocar servicio (energia)
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
        // colorStops: [
        //   { color: "rgba(63, 40, 102, 0)", ratio: 0 }, //rango de 0 a 1
        //   { color: "#472b77", ratio: 0.083 },
        //   { color: "#4e2d87", ratio: 0.166 },
        //   { color: "#563098", ratio: 0.249 },
        //   { color: "#5d32a8", ratio: 0.332 },
        //   { color: "#6735be", ratio: 0.415 },
        //   { color: "#7139d4", ratio: 0.498 },
        //   { color: "#7b3ce9", ratio: 0.581 },
        //   { color: "#853fff", ratio: 0.664 },
        //   // { color: "#a46fbf", ratio: 0.747 },
        //   // { color: "#c29f80", ratio: 0.83 },
        //   // { color: "#e0cf40", ratio: 0.913 },
        //   { color: "#ffff00", ratio: 1 }
        // ],
        maxPixelIntensity: 2000, //formatear tildes ortografia desde la consulta sql select convert('a','utf8','us7ascii') from dual;https://www.google.com/search?rlz=1C1SQJL_esCO841CO841&ei=RrloXcGjNcra5gLPkrboCg&q=poner+utf8+oracle+sql+query&oq=poner+utf8+oracle+sql+query&gs_l=psy-ab.3..33i21.5836.10488..10573...0.2..0.228.885.0j4j1......0....1..gws-wiz.......0i71j33i22i29i30j33i160.1Ubeg3RbUvM&ved=0ahUKEwjB3uao86nkAhVKrVkKHU-JDa0Q4dUDCAo&uact=5
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

      const view = new MapView({
        container: "viewDiv",
        center: [-75.47106040285713, 6.007862882142857], // [horizontal, vertical]
        zoom: 6,
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
