<template>
  <div
    class="modal fade"
    id="kt_modal_edit_typeOfMaterial"
    ref="editTypeOfMaterialModalRef"
    tabindex="-1"
    aria-hidden="true"
      > 
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_edit_typeOfMaterial_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Edit a Type of Material</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_edit_typeOfMaterial_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->
        <!--begin::Form-->
        <el-form
          @submit.prevent="submit()"
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <!--begin::Modal body-->
          <div class="modal-body py-10 px-lg-17">
            <!--begin::Scroll-->
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_edit_typeOfMaterial_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_edit_typeOfMaterial_header"
              data-kt-scroll-wrappers="#kt_modal_edit_typeOfMaterial_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Name</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="name">
                  <el-input
                    v-model="formData.name"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->
            </div>
            <!--end::Scroll-->
          </div>
          <!--end::Modal body-->

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <!--begin::Button-->
            <button
              type="reset"
              id="kt_modal_edit_typeOfMaterial_cancel"
              class="btn btn-light me-3"
            >
              Discard
            </button>
            <!--end::Button-->

            <!--begin::Button-->
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label">
                Submit
                <KTIcon icon-name="arrow-right" icon-class="fs-2 me-2 me-0" />
              </span>
              <span v-if="loading" class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
            <!--end::Button-->
          </div>
          <!--end::Modal footer-->
        </el-form>
        <!--end::Form-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ApiService from "@/core/services/ApiService";
import { success, fail, error } from "@/core/helpers/alertModal";

export default defineComponent({
  name: "edit-typeOfMaterial-modal",
  props: ['typeOfMaterial', 'tableData'],
  components: {},
  setup(props) {
    const formRef = ref<null | HTMLFormElement>(null);
    const editTypeOfMaterialModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    let typeOfMaterialID = ref<String>('');

    const formData = ref({
      name: ""
    });

    watch(() => props.typeOfMaterial, (editTypeOfMaterial) => {
      if (editTypeOfMaterial) {
        formData.value = {
          name: editTypeOfMaterial.name
        };
        typeOfMaterialID = editTypeOfMaterial.id;
      }
    });

    const rules = ref({
      name: [
        {
          required: true,
          message: "Type of Material name is required",
          trigger: "change",
        },
        {
          min: 2,
          message: "Type of Material name must be at least 2 characters",
          trigger: "change",
        }
      ],
    });

    const updateTypeOfMaterial = (typeOfMaterial) => {
      const index = props.tableData.findIndex((item: any) => item.id === typeOfMaterialID);
      
      if (index !== -1) {
        props.tableData[index] = typeOfMaterial;
      }
    };

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true;

          setTimeout(() => {
            loading.value = false;

            (async () => {
              const response = await ApiService.put("/typeOfMaterials/" + typeOfMaterialID, formData.value);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else if (response.status === 200){
                success("Type of Materials updated with success!", editTypeOfMaterialModalRef.value);
                updateTypeOfMaterial(response.data);
              }else{
                error("Something went wrong, please try again later.", editTypeOfMaterialModalRef.value);
              }
            })();
          }, 2000);
        } else {
          Swal.fire({
            text: "Sorry, looks like there are some errors detected, please try again.",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            heightAuto: false,
            customClass: {
              confirmButton: "btn btn-primary",
            },
          });
          return false;
        }
      });
    };

    return {
      formData,
      rules,
      submit,
      formRef,
      loading,
      editTypeOfMaterialModalRef,
    };
  },
});
</script>