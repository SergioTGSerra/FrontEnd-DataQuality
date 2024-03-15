<template>
  <div
    class="modal fade"
    id="kt_modal_edit_organization"
    ref="editOrganizationModalRef"
    tabindex="-1"
    aria-hidden="true"
      > 
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_edit_organization_header">
          <!--begin::Modal title-->
          <h2 class="fw-bold">Edit a Organization</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_edit_organization_close"
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
              id="kt_modal_edit_organization_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_edit_organization_header"
              data-kt-scroll-wrappers="#kt_modal_edit_organization_scroll"
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
                <label class="required fs-6 fw-semibold mb-2">Organization Name</label>
                <!--end::Label-->

                <!--begin::Input-->
                <el-form-item prop="orgName">
                  <el-input
                    v-model="formData.orgName"
                    type="text"
                    placeholder=""
                  />
                </el-form-item>
                <!--end::Input-->

              <!--begin::Input group-->
              <div class="fv-row mb-7">
                <!--begin::Label-->
                <label class="required fs-6 fw-semibold mb-2">Organization Name</label>
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
                  <el-select
                    v-model="formData.country"
                    placeholder="Select"
                  >
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
              id="kt_modal_edit_organization_cancel"
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
import { countries } from "@/core/data/countries";

export default defineComponent({
  name: "edit-organization-modal",
  props: ['organization', 'tableData'],
  components: {},
  setup(props) {
    const formRef = ref<null | HTMLFormElement>(null);
    const editOrganizationModalRef = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false);
    let organizationID = ref<String>('');

    const formData = ref({
      name: "",
      orgName: "",
      eac: "",
      country: "",
    });

    watch(() => props.organization, (editOrganization) => {
      if (editOrganization) {
        formData.value = {
          name: editOrganization.name,
          orgName: editOrganization.orgName,
          eac: editOrganization.eac,
          country: editOrganization.country,
        };
        organizationID = editOrganization.id;
      }
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
        }
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
        }
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
        }
      ],
      country: [
        {
          required: true,
          message: "Country is required",
          trigger: "change",
        },
      ],
    });

    const updateOrganization = (organization) => {
      const index = props.tableData.findIndex((item: any) => item.id === organizationID);
      
      if (index !== -1) {
        props.tableData[index] = organization;
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

            Swal.fire({
              text: "Form has been successfully submitted!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn btn-primary",
              },
            }).then(async () => {
              hideModal(editOrganizationModalRef.value);
              const res = await ApiService.put("/organization/" + organizationID, formData.value);
              updateOrganization(res.data.data);
            });
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
      editOrganizationModalRef,
      countries,
    };
  },
});
</script>