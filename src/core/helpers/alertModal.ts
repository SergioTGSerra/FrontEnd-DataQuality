import Swal from "sweetalert2";
import { hideModal } from "@/core/helpers/modal";

function success(message: string, modalRef: any){
    Swal.fire({
        text: message,
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
            confirmButton: "btn btn-primary",
        },
    }).then(() => {
        hideModal(modalRef);
    });
}

function fail(data: any){
    for (let key in data) {
        let errorMessage = data[key].message;
        Swal.fire({
            text: errorMessage,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
                confirmButton: "btn btn-primary",
            },
        });
    }
}

function error(data: any){
    Swal.fire({
        text: data,
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
            confirmButton: "btn btn-primary",
        },
    });
}

export { success, fail, error };