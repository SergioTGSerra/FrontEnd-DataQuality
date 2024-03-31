<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            v-model="search"
            @input="searchItems()"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Search Organizations"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-organization-table-toolbar="base"
        >
          <!--begin::Export-->
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_organizations_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button>
          <!--end::Export-->
          <!--begin::Add organization-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_organization"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Organization
          </button>
          <!--end::Add organization-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-organization-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewOrganizations()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-organization-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-organization-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-organization-table-select="delete_selected"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <div class="card-body pt-0">
      <Datatable
        @on-sort="sort"
        @on-items-select="onItemSelect"
        @page-change="currentPage"
        @on-items-per-page-change="itemsPerPage"
        :data="tableData"
        :header="tableHeader"
        :enable-items-per-page-dropdown="true"
        :checkbox-enabled="true"
        checkbox-label="id"
        :totalItems="totalItems"
      >
        <template v-slot:name="{ row: organization }">
          {{ organization.name }}
        </template>
        <template v-slot:orgCode="{ row: organization }">
          {{ organization.orgCode }}
        </template>
        <template v-slot:eac="{ row: organization }">
          {{ organization.eac }}
        </template>
        <template v-slot:country="{ row: organization }">
          {{ organization.country }}
        </template>
        <template v-slot:actions="{ row: organization }">
          <!--begin::Edit-->
          <a
            @click="editOrganization(organization)"
            href="#"
            class="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_edit_organization"
            title="Edit"
          >
            <span
              data-bs-toggle="tooltip"
              data-bs-trigger="hover"
              data-bs-original-title="Edit"
            >
              <KTIcon icon-name="pencil" icon-class="fs-3" />
            </span>
          </a>
          <!--end::Edit-->
          <!--begin::Delete-->
          <a
            @click="deleteOrganization(organization.id)"
            href="#"
            class="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
            data-bs-toggle="tooltip"
            data-bs-original-title="Delete"
            title="Delete"
          >
            <KTIcon icon-name="trash" icon-class="fs-3" />
          </a>
          <!--end::Delete-->
        </template>
      </Datatable>
    </div>
  </div>

  <ExportOrganizationModal></ExportOrganizationModal>
  <AddOrganizationModal :tableData="tableData"></AddOrganizationModal>
  <EditOrganizationModal :organization="organization" :tableData="tableData"></EditOrganizationModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
import ExportOrganizationModal from "@/components/modals/forms/ExportMetricModal.vue";
import AddOrganizationModal from "@/views/apps/organizations/AddOrganizationModal.vue";
import EditOrganizationModal from "./EditOrganizationModal.vue";
import type { IOrganization } from "@/core/data/organizations";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const response = await ApiService.get("/organization");
if(response.status === 401) authStore.refreshToken();

const organizations = response.data.data;
const totalItems = response.data.totalElements;

export default defineComponent({
  name: "organizations-listing",
  components: {
    Datatable,
    ExportOrganizationModal,
    AddOrganizationModal,
    EditOrganizationModal,
  },
  setup() {
    const tableHeader = ref([
      {
        columnName: "Name",
        columnLabel: "name",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Org Code",
        columnLabel: "orgCode",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "EAC",
        columnLabel: "eac",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Country",
        columnLabel: "country",
        sortEnabled: true,
        columnWidth: 175,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 135,
      },
    ]);
    const selectedIds = ref<Array<number>>([]);
    const tableData = ref<Array<IOrganization>>(organizations? organizations : []);
    const organization = ref<Object>([]);
    const initOrganizations = ref<Array<IOrganization>>([]);
    let current_page = ref<number>(0);
    let items_per_page = ref<number>(10);

    onMounted(() => {
      initOrganizations.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const editOrganization = (organizationI: IOrganization) => {
      organization.value = organizationI;
    };

    const getOrganizations = async (current_page_param: number, items_per_page_param: number) => {
      if(items_per_page.value !== items_per_page_param){
        const response = await ApiService.get("organization?page=0&items_per_page=" + items_per_page_param);
        tableData.value = response.data.data;
      }else{
        const response = await ApiService.get("organization?page=" + current_page_param + "&items_per_page=" + items_per_page_param);
        tableData.value = response.data.data;
      }
    };

    const currentPage = (page: any) => {
      page = page - 1;
      getOrganizations(page, items_per_page.value);
      current_page.value = page;
    };

    const itemsPerPage = (items: any) => {
      getOrganizations(current_page.value, items);
      items_per_page.value = items;
    };

    const deleteModalConfirmation = (id?: any) => {
      Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete them all!",
          cancelButtonText: "No, cancel!",
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-active-light-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {

            if (selectedIds.value.length > 0){
              selectedIds.value.forEach((item) => {
                ApiService.delete(`/organization/${item}`);
                tableData.value = tableData.value.filter((organization) => organization.id !== item.toString());
              });
              selectedIds.value.length = 0;
            }else{
              ApiService.delete(`/organization/${id}`);
              tableData.value = tableData.value.filter((organization) => organization.id !== id.toString());
            }
            Swal.fire("Deleted!", "Your files have been deleted.", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelled", "Your files are safe :)", "error");
          }
        });
    }

    const deleteFewOrganizations = () => {
      deleteModalConfirmation();
    };

    const deleteOrganization = (id: number) => {
      deleteModalConfirmation(id);
    };

    const search = ref<string>("");
    const searchItems = () => {
      tableData.value.splice(0, tableData.value.length, ...initOrganizations.value);
      if (search.value !== "") {
        let results: Array<IOrganization> = [];
        for (let j = 0; j < tableData.value.length; j++) {
          if (searchingFunc(tableData.value[j], search.value)) {
            results.push(tableData.value[j]);
          }
        }
        tableData.value.splice(0, tableData.value.length, ...results);
      }
      MenuComponent.reinitialization();
    };

    const searchingFunc = (obj: any, value: string): boolean => {
      for (let key in obj) {
        if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
          if (obj[key].indexOf(value) != -1) {
            return true;
          }
        }
      }
      return false;
    };

    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(tableData.value, sort.label, { reverse });
      }
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    return {
      tableData,
      tableHeader,
      deleteOrganization,
      search,
      searchItems,
      selectedIds,
      deleteFewOrganizations,
      sort,
      onItemSelect,
      currentPage,
      editOrganization,
      organization,
      totalItems,
      itemsPerPage,
    };
  },
});
</script>