require("colors");
const { guardarDB, leerDB } = require("./guardarArchivo");
//const { mostrarMenu, pausa } = require("./helpers/mensajes");
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist } = require("./inquirer");
const Tareas = require("./models/tareas");

console.clear();

const main = async () => {
    //console.log("Hola mundo");

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();
    if (tareasDB) {
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        //opt = await mostrarMenu();
        opt = await inquirerMenu();
        console.log({ opt });
        //if (opt !== '0') await pausa();
        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);
                break;

            case '2':
                tareas.listadoCompleto();
                break;

            case '3':
                tareas.listarPendientesCompletadas(true);
                break;

            case '4':
                tareas.listarPendientesCompletadas(false);
                break;

            case '5': //completado ! pendiente
                const ids = await mostrarListadoChecklist(tareas.listadoArr);
                //console.log(ids);
                tareas.toggleCompletadas(ids);
                break;

            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr);
                //console.log(`id tarea a borrar ${id}}`);

                if (id !== '0') {
                    const ok = await confirmar('¿Esta seguro?');
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada');
                    }
                }
                break;
        }

        guardarDB(tareas.listadoArr);
        await pausa();

    } while (opt !== '0');
}

main();