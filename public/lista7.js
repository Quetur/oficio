let dataTable;
    let dataTableIsInitialized = false;

    const dataTableOptions = {
        scrollX: "2000px",
      lengthMenu: [5, 10, 15, 20, 100, 200, 500],
      columnDefs: [{
          className: "centered",
          targets: [0]
        }

        //{ width: "50%", targets: [0] }
      ],
      pageLength: 3,
      destroy: true,
      language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuario encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuario encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        }
      }
    };

    const initDataTable = async () => {
      if (dataTableIsInitialized) {
        dataTable.destroy();
      }

      await listUsers();

      dataTable = $("#datatable_users").DataTable(dataTableOptions);

      dataTableIsInitialized = true;
    };

    const listUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/usuarios");
        const users = await response.json();
        console.log(users)
        let content = ``;
        users.forEach((user, index) => {
          content += `
          <div id="linea" class="">
            <tr > 
              <td>
                <div class="tarjeta">
                  <table border="1" >
                    <tr border=1 class="titulo">
                      <td style="width: 200px;"> ${user.nombre}   ${user.apellido} </td>
                      <td style="align-items: right; width:50px;  align-items: center; text-align: left;">
                        <a href="/home">
                          <img class="estrella" align="center" src="img/m_estrella2.png"></img>
                        <a class="numestrella"> ${user.calificacion} </h2>
                      </td>
                    </tr>
                  </table>
                  <table >
                    <tr class="cuerpo">
                      <td style="width: 250px;">  ${user.oficio} </td>
                    </tr>
                  </table>
                  <table >
                    <tr class="pie">
                      <td>
                        <img class="whatsapp" src="img/whatsapp.png"></img>
                        <a class="texto_whatsapp" > ${user.celular} - ${user.localidad} </h2>
                      </td>
                    </tr>
                  </table>
                </div>

              </td>
              <td></td>
              <td></td>

            
            </tr>  
          </div>
          `;
        });
        tableBody_users.innerHTML = content;
      } catch (ex) {
        alert(ex);
      }
    };

    window.addEventListener("load", async () => {
      await initDataTable();
    });

    // esto hiba entrre las comillas
    /*
    <tr>
    <td>${user.nombre}</td>
    <td>${user.apellido}</td>
    <td>${user.celular}</td>
    <td>${user.localidad}</td>
    <td>${user.oficio}</td>
||||</tr>

   <td>
        
   </td>

          <div class="tarjeta">
          
          <table border=1 >
            <tr border=1 class="titulo">
              <td style="width: 200px;"> ${user.nombre}   ${user.apellido} </td>
              <td style="align-items: right; width:50px;  align-items: center; text-align: left;">
                <a href="/home">
                  <img class="estrella" align="center" src="img/m_estrella2.png"></img>
                <a class="numestrella"> ${user.calificacion} </h2>
              </td>
             
            </tr>
          </table>
          <table>
            <tr class="cuerpo">
              <td>  user.oficio </td>
            </tr>
          </table>
          <table>
            <tr class="pie">
              <td>
                <img class="whatsapp" align="center" src="img/whatsapp.png"></img>
                <a href=""></a>  user.celular -  user.localidad %>
              </td>
              <!--<td> user.localidad </td>-->
            </tr>
          </table>
        </div>


*/