<template>
  <div
    class="modal fade"
    id="kt_modal_edit_lotTypeOfMaterial"
    ref="editLotTypeOfMaterialModalRef"
    tabindex="-1"
    aria-hidden="true"
      > 
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_edit_lotTypeOfMaterial_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Edit Lot Type of Material</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_edit_lotTypeOfMaterial_close"
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
              id="kt_modal_edit_lotTypeOfMaterial_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_edit_lotTypeOfMaterial_header"
              data-kt-scroll-wrappers="#kt_modal_edit_lotTypeOfMaterial_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Type of Material</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="typeOfMaterialId">
                  <el-select v-model="formData.typeOfMaterialId" placeholder="Select type of Material">
                    <el-option
                      v-for="typeOfMaterial in ITypeOfMaterials"
                      :key="typeOfMaterial.id"
                      :label="typeOfMaterial.name"
                      :value="typeOfMaterial.id"
                    >
                      {{ typeOfMaterial.name }}
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Percentage (%)</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="percentage">
                  <el-input
                    v-model="formData.percentage"
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
              id="kt_modal_edit_lotTypeOfMaterial_cancel"
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
import { hideModal } from "@/core/helpers/modal";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ApiService from "@/core/services/ApiService";
import { validationFormulas } from "@/core/data/validationFormulas";
import { success, fail, error } from "@/core/helpers/alertModal";
import { validateMinDeg } from "@/core/helpers/validator";

const response = await ApiService.get("/typeOfMaterials");

const typeOfMaterials = response.data._embedded.typeOfMaterials;

const ITypeOfMaterials: any = typeOfMaterials.map(typeOfMaterial => {
  const id = typeOfMaterial._links.self.href.split('/').pop() as string;
  return {
    id,
    name: typeOfMaterial.name
  };
});

export default defineComponent({
  name: "edit-lotTypeOfMaterial-modal",
  props: ['lotTypeOfMaterial', 'tableData', 'lotId'],
  components: {},
  setup(props) {
    const formRef = ref<null | HTMLFormElement>(null);
    const editLotTypeOfMaterialModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    let lotId = ref<String>('');
    let typeOfMaterialId = ref<String>('');


    const formData = ref({
      typeOfMaterialId: '',
      percentage: '',
    });

    watch(() => props.lotTypeOfMaterial, (editLotTypeOfMaterial) => {
      if (editLotTypeOfMaterial) {
        formData.value = {
          typeOfMaterialId: editLotTypeOfMaterial.id.typeOfMaterial.id,
          percentage: editLotTypeOfMaterial.percentage,
        };
        lotId = props.lotId;
        typeOfMaterialId = editLotTypeOfMaterial.id.typeOfMaterial.id;
      }
    });

    const rules = ref({
      typeOfMaterialId: [{ required: true, message: "Type of material is required", trigger: "change",},],
      percentage: [{ required: true, message: "Percentage is required", trigger: "change" }, { validator: validateMinDeg, trigger: "change" },],
    });

    const updateLotTypeOfMaterial = (lotTypeOfMaterial) => {
      const index = props.tableData.findIndex((item: any) => item.id.typeOfMaterial.id === typeOfMaterialId);
      if (index !== -1) {
        props.tableData[index] = lotTypeOfMaterial;
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
              const data = {
                id: {
                  typeOfMaterial: "http://api.med1.ipvc.bioeconomy-at-textiles.com/v1/typeOfMaterials/" + formData.value.typeOfMaterialId,
                  lot: "http://api.med1.ipvc.bioeconomy-at-textiles.com/v1/lots/" + props.lotId,
                },
                percentage: formData.value.percentage.toString(),
              };

              const response = await ApiService.put("/lotTypeMaterialPercentages/" + lotId + "/" + typeOfMaterialId, data);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else if (response.status === 200){
                success("Lot type of material updated with success!", editLotTypeOfMaterialModalRef.value);
                console.log(response.data);
                updateLotTypeOfMaterial(response.data);
              }else{
                error("Something went wrong, please try again later.", editLotTypeOfMaterialModalRef.value);
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
      editLotTypeOfMaterialModalRef,
      validationFormulas,
      hideModal,
      ITypeOfMaterials
    };
  },
});
</script>