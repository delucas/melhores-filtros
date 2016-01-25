// Helpers
 Date.prototype.weFormat = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString();
   var dd  = this.getDate().toString();
   return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
 };

// Aquí comienza la intervención

 function fiddle() {

    var BRL_PER_USD = 4.09;

    if (!$("body").hasClass("geekviajero")) {

      // Calculamos las estadias y cambiamos los formatos de fecha
      $(".tbtrechos tr").each(function(index, item) {

        if (index == 0) return;

        var price = parseInt($(item).find(".pc").text().split(" ")[1].replace('.',''));
        var priceCell = $(item).find(".pc");
        priceCell.html(priceCell.text() + "<br/>USD " + (price/BRL_PER_USD).toFixed(2));


        var sale = $($(item).find('.dt')[0]).text().split('/');
        var llega = $($(item).find('.dt')[1]).text().split('/');
        var thisMonth = (new Date()).getMonth()+1;
        var thisYear = (new Date()).getFullYear();
        var fechaSale = new Date( (parseInt(sale[1])>=thisMonth ? thisYear + '/' : (thisYear+1) + '/') + sale[1] + '/' + sale[0]);
        $($(item).find('.dt')[0]).text(fechaSale.weFormat());
        var fechaLlega = new Date( (parseInt(llega[1])>=thisMonth ? thisYear + '/' : (thisYear+1) + '/') + llega[1] + '/' + llega[0]);
        $($(item).find('.dt')[1]).text(fechaLlega.weFormat());

        var estadia = parseInt((fechaLlega - fechaSale) / (1000 * 60 * 60 * 24));

        var toCell = $($(item).find(".dt")[1]);
        toCell.html(toCell.text() + "<br/>" + estadia + " dias");


      });

      // Removemos filtros de la página
      $(".filtros_tabela").detach();

      // Rearmamos la tabla para que sea DataTables-friendly
      headers = $(".tbtrechos tr").first();

      var cols = headers.find('th');
      $(cols[0]).addClass('select-filter');
      $(cols[1]).addClass('select-filter');
      $(cols[5]).addClass('select-filter');

      headers.parent().parent().prepend("<thead>");
      headers.parent().parent().prepend("<tfoot>");
      headers.parent().parent().find("thead").append(headers);
      var footers = headers.clone();
      footers.children().css('padding', '0.4em');
      footers.children().text('');
      headers.parent().parent().find("tfoot").append(footers);

      // Agregamos CSS y JS de DataTables, e invocamos
        $("head").append(
          $("<link>")
          .attr('rel', 'stylesheet')
          .attr('type', 'text/css')
          .attr('href', 'https://cdn.datatables.net/1.10.10/css/jquery.dataTables.min.css')
          )
         $('.tbtrechos').dataTable(

{
        initComplete: function () {
            this.api().columns('.select-filter').every( function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
  
                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );
  
                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        }
    } 

          );

        // Marcamos el body, para no ejecutar dos veces
      $("body").addClass("geekviajero");

    }

 }
   fiddle();

