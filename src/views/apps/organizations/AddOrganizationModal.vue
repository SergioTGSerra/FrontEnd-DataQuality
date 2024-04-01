<template>
  <div
    class="modal fade"
    id="kt_modal_add_organization"
    ref="addOrganizationModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_organization_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Add a Organization</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_organization_close"
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
              id="kt_modal_add_organization_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_organization_header"
              data-kt-scroll-wrappers="#kt_modal_add_organization_scroll"
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

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Org Code</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="orgCode">
                  <el-input
                    v-model="formData.orgCode"
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
                <label class="required fs-6 fw-semibold mb-2">Eac</label>
                <!--end::Label-->
                <!--begin::Input-->
                <el-form-item prop="eac">
                  <el-input
                    v-model="formData.eac"
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
                <label class="required fs-6 fw-semibold mb-2">Country</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="country">
                  <el-select v-model="formData.country" placeholder="Select country">
                    <el-option
                      v-for="country in countries"
                      :key="country.code"
                      :label="country.name"
                      :value="country.code"
                    >
                      {{ country.name }}
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Passsword</label>
                <!--end::Label-->
                <!--begin::Input-->
                <el-form-item prop="password">
                  <el-input
                    v-model="formData.password"
                    type="password"
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
              id="kt_modal_add_organization_cancel"
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
import { countries } from "@/core/data/countries";
import { success, fail, error } from "@/core/helpers/alertModal";

export default defineComponent({
  name: "add-organization-modal",
  components: {},
  props: {
    tableData: Array,
  },
  setup(props) {
    const formRef = ref<null | HTMLFormElement>(null);
    const addOrganizationModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);

    const formData = ref({
      name: "",
      orgCode: "",
      eac: "",
      country: "",
      password: "",
    });

    const rules = ref({
      name: [
        {
          required: true,
          message: "Organization name is required",
          trigger: "change",
        },
        {
          min: 2,
          message: "Organization name must be at least 2 characters",
          trigger: "change",
        },
      ],
      orgName: [
        {
          required: true,
          message: "Organization name is required",
          trigger: "change",
        },
        {
          min: 2,
          message: "Organization name must be at least 2 characters",
          trigger: "change",
        },
      ],
      eac: [
        {
          required: true,
          message: "EAC is required",
          trigger: "change",
        },
        {
          min: 2,
          message: "EAC must be at least 2 characters",
          trigger: "change",
        },
      ],
      country: [
        {
          required: true,
          message: "Country is required",
          trigger: "change",
        },
      ],
      password: [
        {
          required: true,
          message: "Password is required",
          trigger: "change",
        },
        {
          min: 8,
          message: "Password must be at least 8 characters",
          trigger: "change",
        },
      ],
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
              const response = await ApiService.post("/organization", formData.value);
            
              if (response.data.status === "fail")  fail(response.data.data);
              else if(response.data.status === "error") error(response.data.message);
              else{
                success("Organization created with success!", addOrganizationModalRef.value);
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
      addOrganizationModalRef,
      countries
    };
  },
});
</script>