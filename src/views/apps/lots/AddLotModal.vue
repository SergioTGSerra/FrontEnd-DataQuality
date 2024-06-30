<template>
  <div
    class="modal fade"
    id="kt_modal_add_lot"
    ref="addLotModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_lot_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Add a Lot</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_lot_close"
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
              id="kt_modal_add_lot_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_lot_header"
              data-kt-scroll-wrappers="#kt_modal_add_lot_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Reference</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="reference">
                  <el-input
                    v-model="formData.reference"
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
                <label class="required fs-6 fw-semibold mb-2">Produced Quantity</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="producedQuantity">
                  <el-input
                    v-model="formData.producedQuantity"
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
                <label class="required fs-6 fw-semibold mb-2">Production Activity</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="productionActivity">
                  <el-select
                    v-model="formData.productionActivity"
                    placeholder="Select production activity"
                  >
                    <el-option
                      v-for="productionActivity in IProductionActivities"
                      :key="productionActivity.id"
                      :label="productionActivity.name"
                      :value="productionActivity.id"
                    />
                  </el-select>
                </el-form-item>
                <!--end::Input-->
              
            </div>
            <!--end::Scroll-->
            </div>
          </div>
          <!--end::Modal body-->

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <!--begin::Button-->
            <button
              type="reset"
              id="kt_modal_add_lot_cancel"
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

const response = await ApiService.get("/productionActivities");
const productionActivities = response.data._embedded.productionActivities;

const IProductionActivities: any = productionActivities.map(productionActivity => {
  const id = productionActivity._links.self.href.split('/').pop() as string;
  return {
    id,
    name: productionActivity.name
  };
});

export default defineComponent({
  name: "add-lot-modal",
  components: {},
  props: {
    tableData: Array,
  },
  setup(props) {
    const formRef = ref<null | HTMLFormElement>(null);
    const addLotModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    const formData = ref({
      reference: "",
      producedQuantity: "",
      productionActivity: "",
    });

    const rules = ref({
      reference: [
        { required: true, message: "Reference is required", trigger: "blur" },
      ],
      producedQuantity: [
        { required: true, message: "Produced Quantity is required", trigger: "blur" },
      ],
      productionActivity: [
        { required: true, message: "Please select production activity", trigger: "change" },
      ],
    });

    const getProductionActivityById = async (id: string) => {
      try {
        const response = await ApiService.get(`/lots`, id + `/productionActivity`);
        return response.data;
      } catch (error) {
        console.error(`Erro ao carregar o nome do lote: ${error}`);
        return null;
      }
    };

    const convertToILot = async (lot: any) => {
      const id = lot._links.self.href.split('/').pop() as string;
      const productionActivityId = lot._links.productionActivity.href.split('/')[5];
      const productionActivity = await getProductionActivityById(productionActivityId);
      return {
        id,
        reference: lot.reference,
        producedQuantity: lot.producedQuantity,
        productionActivityId: productionActivityId ? productionActivityId : "",
        productionActivityName: productionActivity.name ? productionActivity.name : "",
      };
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
                reference: formData.value.reference,
                producedQuantity: formData.value.producedQuantity,
                productionActivity: "http://api.med1.ipvc.bioeconomy-at-textiles.com/v1/productionActivities/" + formData.value.productionActivity,
              };
              
              const response = await ApiService.post("/lots", data);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else if(response.status === 201){
                success("Lot created with success!", addLotModalRef.value);
                props.tableData?.push(await convertToILot(response.data));
              }else{
                error("Something went wrong, please try again later.", addLotModalRef.value);
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
      addLotModalRef,
      IProductionActivities
    };
  },
});
</script>