<template>
  <div
    class="modal fade"
    id="kt_modal_associate_productionActivity"
    ref="associateProductionActivityModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_associate_productionActivity_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Associate metric to production activity</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_associate_productionActivity_close"
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
              id="kt_modal_associate_productionActivity_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_associate_productionActivity_header"
              data-kt-scroll-wrappers="#kt_modal_associate_productionActivity_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Metric</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="metricId">
                  <el-select v-model="formData.metricId" placeholder="Select metric">
                    <el-option
                      v-for="metric in metrics"
                      :key="metric.id"
                      :label="metric.name"
                      :value="metric.id"
                    >
                      {{ metric.name }}
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->
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
                <label class="required fs-6 fw-semibold mb-2">Min Deg Valid</label>
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
                <label class="required fs-6 fw-semibold mb-2">Min Deg Suspect</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="minDegSuspect">
                  <el-input
                    v-model="formData.minDegSuspect"
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
              id="kt_modal_associate_productionActivity_cancel"
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
import { defineComponent, ref } from "vue";
import Swal from "sweetalert2";
import ApiService from "@/core/services/ApiService";
import { validationFormulas } from "@/core/data/validationFormulas";
import { success, fail, error } from "@/core/helpers/alertModal";

const response = await ApiService.get("/metric");
const metrics = response.data.data;

export default defineComponent({
  name: "associate-productionActivity-modal",
  components: {},
  props: ["tableData", "productionActivityId"],
  setup(props) {
    const formRef = ref<null | HTMLFormElement>(null);
    const associateProductionActivityModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    const formData = ref({
      min: "",
      max: "",
      mean: "",
      k: "",
      minDegValid: "",
      minDegSuspect: "",
      validationFormula: "",
      productionActivityId: props.productionActivityId,
      metricId: "",
    });

    const rules = ref({

    });

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
              const response = await ApiService.post("/production-activity-metric", formData.value);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else if (response.data.status === "success"){
                success("The metric was associated with success!", associateProductionActivityModalRef.value);
                props.tableData?.push(response.data.data);
              }else{
                error("Something went wrong, please try again.", associateProductionActivityModalRef.value);
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
      associateProductionActivityModalRef,
      validationFormulas,
      metrics,
    };
  },
});
</script>