<template>
  <div
    class="modal fade"
    id="kt_modal_edit_productionActivity"
    ref="editProductionActivityModalRef"
    tabindex="-1"
    aria-hidden="true"
      > 
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_edit_productionActivity_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Edit a production activity</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_edit_productionActivity_close"
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
              id="kt_modal_edit_productionActivity_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_edit_productionActivity_header"
              data-kt-scroll-wrappers="#kt_modal_edit_productionActivity_scroll"
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
              id="kt_modal_edit_productionActivity_cancel"
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
  name: "edit-productionActivity-modal",
  props: ['productionActivity', 'tableData'],
  components: {},
  setup(props, { emit }) {
    const formRef = ref<null | HTMLFormElement>(null);
    const editProductionActivityModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    let productionActivityID = ref<String>('');

    const formData = ref({
      name: ""
    });

    watch(() => props.productionActivity, (editProductionActivity) => {
      if (editProductionActivity) {
        formData.value = {
          name: editProductionActivity.name
        };
        productionActivityID = editProductionActivity.id;
      }
    });

    const rules = ref({
      name: [
        {
          required: true,
          message: "Production Activity name is required",
          trigger: "change",
        },
        {
          min: 2,
          message: "Production Activity name must be at least 2 characters",
          trigger: "change",
        }
      ],
    });

    const updateProductionActivity = (productionActivity) => {
      const index = props.tableData.findIndex((item: any) => item.id === productionActivityID);
      
      if (index !== -1) {
        props.tableData[index] = productionActivity;
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
              const response = await ApiService.put("/productionActivities/" + productionActivityID, formData.value);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else if (response.status === 200){
                success("Production activity updated with success!", editProductionActivityModalRef.value);
                updateProductionActivity(response.data);
                props.productionActivity.value = response.data;
                emit('productionActivityUpdated', props.productionActivity.value);
              }else{
                error("Something went wrong, please try again later.", editProductionActivityModalRef.value);
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
      editProductionActivityModalRef,
    };
  },
});
</script>