<template>
  <div
    class="modal fade"
    id="kt_modal_edit_productionActivityMetric"
    ref="editProductionActivityMetricModalRef"
    tabindex="-1"
    aria-hidden="true"
      > 
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_edit_productionActivityMetric_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Edit a production activity Metric</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_edit_productionActivityMetric_close"
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
              id="kt_modal_edit_productionActivityMetric_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_edit_productionActivityMetric_header"
              data-kt-scroll-wrappers="#kt_modal_edit_productionActivityMetric_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Min</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="min">
                  <el-input
                    v-model="formData.min"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Max</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="max">
                  <el-input
                    v-model="formData.max"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->
              
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Mean</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="mean">
                  <el-input
                    v-model="formData.mean"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">K</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="k">
                  <el-input
                    v-model="formData.k"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Min Degree of Validity</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="minDegValid">
                  <el-input
                    v-model="formData.minDegValid"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Min Suspect of Validity</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="minDegSuspect">
                  <el-input
                    v-model="formData.minDegSuspect"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Validation Formula</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="validationFormula">
                  <el-select v-model="formData.validationFormula" placeholder="Select validationFormula">
                    <el-option
                      v-for="validationFormula in validationFormulas"
                      :key="validationFormula.name"
                      :label="validationFormula.name"
                      :value="validationFormula.name"
                    >
                      {{ validationFormula.name }}
                    </el-option>
                  </el-select>
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
              id="kt_modal_edit_productionActivityMetric_cancel"
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

export default defineComponent({
  name: "edit-productionActivityMetric-modal",
  props: ['productionActivitiesMetrics', 'tableData', 'productionActivityId'],
  components: {},
  setup(props) {
    const formRef = ref<null | HTMLFormElement>(null);
    const editProductionActivityMetricModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    let productionActivityId = ref<String>('');
    let metricId = ref<String>('');


    const formData = ref({
      min: "",
      max: "",
      mean: "",
      k: "",
      minDegValid: "",
      minDegSuspect: "",
      validationFormula: "",
      productionActivityId: "",
      metricId: "",
    });

    watch(() => props.productionActivitiesMetrics, (editproductionActivityMetric) => {
      if (editproductionActivityMetric) {
        formData.value = {
          min: editproductionActivityMetric.min,
          max: editproductionActivityMetric.max,
          mean: editproductionActivityMetric.mean,
          k: editproductionActivityMetric.k,
          minDegValid: editproductionActivityMetric.minDegValid,
          minDegSuspect: editproductionActivityMetric.minDegSuspect,
          validationFormula: editproductionActivityMetric.validationFormula,
          productionActivityId: props.productionActivityId,
          metricId: editproductionActivityMetric.metric.id,
        };
        productionActivityId = props.productionActivityId;
        metricId = editproductionActivityMetric.metric.id;
      }
    });

    const rules = ref({
      min: [{ required: true, message: "Min is required", trigger: "change",},],
      max: [{ required: true, message: "Max is required", trigger: "change",},],
      mean: [{ required: true, message: "Mean is required", trigger: "change",},],
      k: [{ required: true, message: "K is required", trigger: "change",},],
      minDegValid: [{ required: true, message: "Min Degree of Validity is required", trigger: "change",},],
      minDegSuspect: [{ required: true, message: "Min Suspect of Validity is required", trigger: "change",},],
      validationFormula: [{ required: true, message: "Validation Formula is required", trigger: "change",},],
    });

    const updateproductionActivityMetric = (productionActivityMetric) => {
      const index = props.tableData.findIndex((item: any) => item.metric.id === metricId);
      if (index !== -1) {
        props.tableData[index] = productionActivityMetric;
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
              const response = await ApiService.put("/production-activity-metric/" + metricId + "/" + productionActivityId, formData.value);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else{
                success("Production activity metric updated with success!", editProductionActivityMetricModalRef.value);
                updateproductionActivityMetric(response.data.data);
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
      editProductionActivityMetricModalRef,
      validationFormulas,
      hideModal,
    };
  },
});
</script>