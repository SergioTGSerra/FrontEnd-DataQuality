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
                <label class="required fs-6 fw-semibold mb-2">Lot</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="lotId">
                  <el-select
                    v-model="formData.lotId"
                    placeholder="Select"
                  >
                    <el-option
                      v-for="item in lots"
                      :key="item.id"
                      :label="item.reference"
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
import Swal from "sweetalert2/dist/sweetalert2.js";
import ApiService from "@/core/services/ApiService";
import { success, fail, error } from "@/core/helpers/alertModal";

const responseMetrics = await ApiService.get("/metrics");
const metrics = responseMetrics.data._embedded.metrics;

const IMetrics: any = metrics.map(metric => {
  const id = metric._links.self.href.split('/').pop() as string;
  return {
    id,
    name: metric.name,
    description: metric.description,
    unit: metric.unit
  };
});

const responseLots = await ApiService.get("/lots");
const lots = responseLots.data._embedded.lots;

const getProductionActivityById = async (id: string) => {
  try {
    const response = await ApiService.get(`/lots`, id + `/productionActivity`);

    return response.data;
  } catch (error) {
    console.error(`Erro ao carregar o nome do lote: ${error}`);
    return null;
  }
};

const ILots: any = await Promise.all(lots.map(async (lot: any) => {
  const id = lot._links.self.href.split('/').pop() as string;
  const productionActivityId = lot._links.productionActivity.href.split('/')[5];
  const productionActivity = await getProductionActivityById(productionActivityId);
  return {
    id,
    reference: lot.reference,
    producedQuantity: lot.producedQuantity,
    productionActivityId : productionActivityId,
    productionActivityName: productionActivity.name ? productionActivity.name : "",
  };
}));

const responseProductionActivities = await ApiService.get("/productionActivities");
const productionActivities = responseProductionActivities.data._embedded.productionActivities;

const IProductionActivities: any = productionActivities.map(productionActivity => {
  const id = productionActivity._links.self.href.split('/').pop() as string;
  return {
    id,
    name: productionActivity.name
  };
});

const getProductionActivityByRecordId = async (id: string) => {
  try {
    const response = await ApiService.get(`/valueRecords`, id + `/productionActivity`);

    return response.data;
  } catch (error) {
    console.error(`Erro ao carregar o nome do lote: ${error}`);
    return null;
  }
};

const getOrganizationById = async (id: string) => {
  try {
    const response = await ApiService.get(`/valueRecords`, id + `/organization`);

    return response.data;
  } catch (error) {
    console.error(`Erro ao carregar o nome do lote: ${error}`);
    return null;
  }
};

const getMetricById = async (id: string) => {
  try {
    const response = await ApiService.get(`/valueRecords`, id + `/metric`);

    return response.data;
  } catch (error) {
    console.error(`Erro ao carregar o nome do lote: ${error}`);
    return null;
  }
};

const getLotById = async (id: string) => {
  try {
    const response = await ApiService.get(`/valueRecords`, id + `/lot`);

    return response.data;
  } catch (error) {
    console.error(`Erro ao carregar o nome do lote: ${error}`);
    return null;
  }
};

const convertToIValueRecord = async (valueRecord: any): Promise<any> => {
  const id = valueRecord._links.self.href.split('/').pop() as string;
  const productionActivityId = valueRecord._links.productionActivity.href.split('/')[5];
  const productionActivity = await getProductionActivityByRecordId(productionActivityId);
  const organizationId = valueRecord._links.organization.href.split('/')[5];
  const organization = await getOrganizationById(organizationId);
  const metricId = valueRecord._links.metric.href.split('/')[5];
  const metric = await getMetricById(metricId);
  const lotId = valueRecord._links.lot.href.split('/')[5];
  const lot = await getLotById(lotId);

  return {
    id,
    value: valueRecord.value,
    validityDegree: valueRecord.validityDegree,
    validityCategory: valueRecord.validityCategory,
    lot: lot.reference,
    organization: organization.name,
    metric: metric.name,
    productionActivity: productionActivity.name
  };
};


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
      value: 0,
      lotId: "",
      organizationId: "",
      metricId: "",
      productionActivityId: ""
    });

    const rules = ref({
      value: [{ required: true, message: "Value is required", trigger: "blur" }],
      lotId: [{ required: true, message: "Lot is required", trigger: "blur" }],
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
              const data = {
                  value: formData.value.value,
                  lot: "http://api.med1.ipvc.bioeconomy-at-textiles.com/v1/lots/" + formData.value.lotId,
                  metric: "http://api.med1.ipvc.bioeconomy-at-textiles.com/v1/metrics/" + formData.value.metricId,
                  organization: "http://api.med1.ipvc.bioeconomy-at-textiles.com/v1/organizations/88cb5dbf-9ab1-4723-8d83-791c8faef570",
                  productionActivity: "http://api.med1.ipvc.bioeconomy-at-textiles.com/v1/productionActivities/" + formData.value.productionActivityId
              };

              const response = await ApiService.post("/valueRecords", data);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else if(response.status === 201){
                success("Value record created with success!", addValueRecordModalRef.value);
                props.tableData?.push(await convertToIValueRecord(response.data));
              }else{
                error("Something went wrong, please try again.", addValueRecordModalRef.value);
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
      metrics: IMetrics,
      productionActivities: IProductionActivities,
      lots: ILots,
    };
  },
});
</script>