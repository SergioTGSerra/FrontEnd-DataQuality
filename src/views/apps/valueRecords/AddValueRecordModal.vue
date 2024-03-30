<template>
  <div
    class="modal fade"
    id="kt_modal_add_valueRecord"
    ref="addValueRecordModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_valueRecord_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Add a Value Record</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_valueRecord_close"
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
              id="kt_modal_add_valueRecord_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_valueRecord_header"
              data-kt-scroll-wrappers="#kt_modal_add_valueRecord_scroll"
              data-kt-scroll-offset="300px"
            >
            
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Value</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="value">
                  <el-input
                    v-model="formData.value"
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
                <label class="required fs-6 fw-semibold mb-2">Lot reference</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="description">
                  <el-input
                    v-model="formData.lotReference"
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
                <label class="required fs-6 fw-semibold mb-2">Organization</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="organizationId">
                  <el-select
                    v-model="formData.organizationId"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in organizations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Metric</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="metricId">
                  <el-select
                    v-model="formData.metricId"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in metrics"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">
                  Production Activity
                </label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="productionActivityId">
                  <el-select
                    v-model="formData.productionActivityId"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in productionActivities"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
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
              id="kt_modal_add_valueRecord_cancel"
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
import { hideModal } from "@/core/helpers/modal";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ApiService from "@/core/services/ApiService";
import { success, fail, error } from "@/core/helpers/alertModal";

const responseMetrics = await ApiService.get("/metric");
const metrics = responseMetrics.data.data;

const responseOrganizations = await ApiService.get("/organization");
const organizations = responseOrganizations.data.data;

const responseProductionActivities = await ApiService.get("/production-activity");
const productionActivities = responseProductionActivities.data.data;

export default defineComponent({
  name: "add-valueRecord-modal",
  components: {},
  props: {
    tableData: Array,
  },
  setup(props) {
    const formRef = ref<null | HTMLFormElement>(null);
    const addValueRecordModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    const formData = ref({
      value: "",
      lotReference: "",
      organizationId: "",
      metricId: "",
      productionActivityId: ""
    });

    const rules = ref({
      value: [{ required: true, message: "Value is required", trigger: "blur" }],
      lotReference: [{ required: true, message: "Lot Reference is required", trigger: "blur" }],
      organizationId: [{ required: true, message: "Organization is required", trigger: "blur" }],
      metricId: [{ required: true, message: "Metric is required", trigger: "blur" }],
      productionActivityId: [{ required: true, message: "Production Activity is required", trigger: "blur" }],
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
              const response = await ApiService.post("/value-record", formData.value);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else{
                success("Value record created with success!", addValueRecordModalRef.value);
                props.tableData?.push(response.data.data);
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
      addValueRecordModalRef,
      metrics,
      organizations,
      productionActivities
    };
  },
});
</script>