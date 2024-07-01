<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <!-- <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            v-model="search"
            @input="searchItems()"
            class="form-control form-control-solid w-250px ps-15"
            placeholder="Search Production Activity"
          />
        </div> -->
        <!--end::Search-->
      </div>
      <!--begin::Card title-->
      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-typeOfMaterial-table-toolbar="base"
        >
          <!--begin::Export-->
          <!-- <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_typeOfMaterials_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button> -->
          <!--end::Export-->
          <!--begin::Add typeOfMaterial-->
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_add_typeOfMaterial"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add Type Of Materials
          </button>
          <!--end::Add typeOfMaterial-->
        </div>
        <!--end::Toolbar-->
        <!--begin::Group actions-->
        <div
          v-else
          class="d-flex justify-content-end align-items-center"
          data-kt-typeOfMaterial-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="deleteFewTypeOfMaterials()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
        <!--begin::Group actions-->
        <div
          class="d-flex justify-content-end align-items-center d-none"
          data-kt-typeOfMaterial-table-toolbar="selected"
        >
          <div class="fw-bold me-5">
            <span
              class="me-2"
              data-kt-typeOfMaterial-table-select="selected_count"
            ></span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            data-kt-typeOfMaterial-table-select="delete_selected"
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
        <template v-slot:name="{ row }">
          {{ row.name }}
        </template>
        <template v-slot:actions="{ row }">
          <!--begin::Edit-->
          <a
            @click="editTypeOfMaterial(row)"
            href="#"
            class="btn btn-icon btn-active-light-primary w-30px h-30px me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_edit_typeOfMaterial"
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
            @click="deleteTypeOfMaterial(row.id)"
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

  <!-- <ExportTypeOfMaterialModal></ExportTypeOfMaterialModal> -->
  <AddTypeOfMaterialModal :tableData="tableData"></AddTypeOfMaterialModal>
  <EditTypeOfMaterialModal :typeOfMaterial="typeOfMaterial" :tableData="tableData"></EditTypeOfMaterialModal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable//table-partials/models";
// import ExportTypeOfMaterialModal from "@/components/modals/forms/ExportTypeOfMaterialModal.vue";
import AddTypeOfMaterialModal from "./AddTypeOfMaterialModal.vue";
import EditTypeOfMaterialModal from "./EditTypeOfMaterialModal.vue";
import type { ITypeOfMaterial } from "@/core/data/typeOfMaterials";
import arraySort from "array-sort";
import { MenuComponent } from "@/assets/ts/components";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const response = await ApiService.get("/typeOfMaterials");
if(response.status === 401) authStore.refreshToken();

const typeOfMaterials = response.data._embedded.typeOfMaterials;
const totalItems = response.data.page.totalElements;

const ITypeOfMaterials: ITypeOfMaterial[] = typeOfMaterials.map(typeOfMaterial => {
  const id = typeOfMaterial._links.self.href.split('/').pop() as string;
  return {
    id,
    name: typeOfMaterial.name
  };
});

export default defineComponent({
  name: "typeOfMaterials-listing",
  components: {
    Datatable,  
    AddTypeOfMaterialModal,
    EditTypeOfMaterialModal,
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
        columnName: "Actions",
        columnLabel: "actions",
        sortEnabled: false,
        columnWidth: 100,
      },
    ]);
    const selectedIds = ref<Array<number>>([]);
    const tableData = ref<Array<ITypeOfMaterial>>(ITypeOfMaterials? ITypeOfMaterials : []);
    const typeOfMaterial = ref<Object>([]);
    const initTypeOfMaterials = ref<Array<ITypeOfMaterial>>([]);
    let current_page = ref<number>(0);
    let items_per_page = ref<number>(10);

    onMounted(() => {
      initTypeOfMaterials.value.splice(0, tableData.value.length, ...tableData.value);
    });

    const editTypeOfMaterial = (TypeOfMaterialI: ITypeOfMaterial) => {
      typeOfMaterial.value = TypeOfMaterialI;
    };

    const getTypeOfMaterials = async (current_page_param: number, items_per_page_param: number) => {
      if(items_per_page.value !== items_per_page_param){
        const response = await ApiService.get("typeOfMaterials?page=0&size=" + items_per_page_param);
        const typeOfMaterials = response.data._embedded.typeOfMaterials;
        const ITypeOfMaterials: ITypeOfMaterial[] = typeOfMaterials.map(typeOfMaterial => {
          const id = typeOfMaterial._links.self.href.split('/').pop() as string;
          return {
            id,
            name: typeOfMaterial.name
          };
        });
        tableData.value = ITypeOfMaterials;
      }else{
        const response = await ApiService.get("typeOfMaterials?page=" + current_page_param + "&size=" + items_per_page_param);
        const typeOfMaterials = response.data._embedded.typeOfMaterials;
        const ITypeOfMaterials: ITypeOfMaterial[] = typeOfMaterials.map(typeOfMaterial => {
          const id = typeOfMaterial._links.self.href.split('/').pop() as string;
          return {
            id,
            name: typeOfMaterial.name
          };
        });
        tableData.value = ITypeOfMaterials;
      }
    };

    const currentPage = (page: any) => {
      page = page - 1;
      getTypeOfMaterials(page, items_per_page.value);
      current_page.value = page;
    };

    const itemsPerPage = (items: any) => {
      getTypeOfMaterials(current_page.value, items);
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
                ApiService.delete(`/typeOfMaterials/${item}`);
                tableData.value = tableData.value.filter((typeOfMaterial) => typeOfMaterial.id !== item.toString());
              });
              selectedIds.value.length = 0;
            }else{
              ApiService.delete(`/typeOfMaterials/${id}`);
              tableData.value = tableData.value.filter((typeOfMaterial) => typeOfMaterial.id !== id.toString());
            }
            Swal.fire("Deleted!", "Type Of Material have been deleted.", "success");
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Cancelled", "Your Type Of Materials are safe :)", "error");
          }
        });
    }

    const deleteFewTypeOfMaterials = () => {
      deleteModalConfirmation();
    };

    const deleteTypeOfMaterial = (id: number) => {
      deleteModalConfirmation(id);
    };

    // const search = ref<string>("");
    // const searchItems = () => {
    //   tableData.value.splice(0, tableData.value.length, ...initTypeOfMaterials.value);
    //   if (search.value !== "") {
    //     let results: Array<ITypeOfMaterial> = [];
    //     for (let j = 0; j < tableData.value.length; j++) {
    //       if (searchingFunc(tableData.value[j], search.value)) {
    //         results.push(tableData.value[j]);
    //       }
    //     }
    //     tableData.value.splice(0, tableData.value.length, ...results);
    //   }
    //   MenuComponent.reinitialization();
    // };

    // const searchingFunc = (obj: any, value: string): boolean => {
    //   for (let key in obj) {
    //     if (!Number.isInteger(obj[key]) && !(typeof obj[key] === "object")) {
    //       if (obj[key].indexOf(value) != -1) {
    //         return true;
    //       }
    //     }
    //   }
    //   return false;
    // };

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
      deleteTypeOfMaterial,
      selectedIds,
      deleteFewTypeOfMaterials,
      sort,
      onItemSelect,
      editTypeOfMaterial,
      typeOfMaterial,
      currentPage,
      itemsPerPage,
      totalItems,
    };
  },
});
</script>