"use client";
import {  Fragment } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Dialog, DialogPanel,  Transition, TransitionChild } from '@headlessui/react';
import AddExpenseForm from '../expenses/AddExpenseForm';
import EditExpenseForm from '../expenses/EditExpenseForm';
import DeleteExpenseForm from '../expenses/DeleteExpenseForm';

// un diccionario en el que las propiedades cuyos valores son nombres de los componentes
const componentMap = {
    "AddExpense": AddExpenseForm,
    "EditExpense": EditExpenseForm,
    "DeleteExpense": DeleteExpenseForm
}

export default function ModalContainer() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  //obtenemos el parametro necesario para mostrar o no el modal
  const showModalParam = searchParams.get('showModal');
  const show = showModalParam ? true : false

  //logica para mostrar el componente segun el parametro expense
  //obtenemos el addExpense desde searchParams
  const addExpenseParam = searchParams.get('addExpense');
  const editExpenseParam = searchParams.get('editExpenseId');
  const deleteExpenseParam = searchParams.get('deleteExpenseId')

  //en funcion del parametro que nos viene en la url, devolvemos un nombre de componente u otro
  const getComponentName = () => {
    if(addExpenseParam) return "AddExpense";
    if(editExpenseParam) return "EditExpense";
    if(deleteExpenseParam) return "DeleteExpense";
  }

  //almacenamos el valor devuelto componentName === "AddExpense" por ejemplo
  const componentName = getComponentName();
  //si tenemos un nombre del componente lo buscamos en el mapa, sino devolvemos un null
  //es simplemente una variable que contiene una referencia a un componente (que realmente es una funcion)
  //react renderza el componente que esta variable almacena
  const ComponentToRender = componentName ? componentMap[componentName] : null
  

  const closeModal = () => {
    const hideModal = new URLSearchParams(searchParams.toString()); // = ?showModal=true&addExpense=true
    Array.from(hideModal.entries()).forEach(([key]) => {
      hideModal.delete(key)
    }); /**
    [
  ["showModal", "true"],
  ["addExpense", "true"]

  después de esto hideModal = ""
] */
    router.replace(`${pathname}?${hideModal}`) // despues queda en /admin/budgets
  }

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                 {/* si tenemos un componente lo renderizamos como un componente sino nada */}
                 {ComponentToRender ? <ComponentToRender closeModal={closeModal}/> : null}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}