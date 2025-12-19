import { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, MenuItem, FormControl, InputLabel, Button, FormHelperText, TextField, Box, Backdrop, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import './style.scss';
import mapInfoIcon from '../../../public/svg/info.svg';
import rightArrowIcon from '../../../public/svg/icon right.svg';
import axios from 'axios';
import api from "../../api/axios";
import errorIcon from '../../../public/svg/empty-img-gray.svg';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const DetailsButton = styled.button`
  padding: 10px 18px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);

  &:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 8px rgba(37, 99, 235, 0.3);
  }
`;


interface FormData {
  district: string;
  subDistrict: string;
  circle: string;
  mouza: string;
  lot: string;
  villageType: string;
}

interface ModalFormData {
  pattaType: string
  pattaNumber: number | null
  dagNumber: number | null
  bigha: number
  lessa: number
  katha: number
  landPhoto?: File | null
  pattadarId?: string
}

const CitizenApplication = () => {
  const [isModalProceedClicked, setIsModalProceedClicked] = useState(false);
  const [areaTableData, setAreaTableData] = useState([{ bigha: 0, lessa: 0, katha: 0 }]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fieldLoading, setFieldLoading] = useState<string | null>(null);
  const [ekhajanaReceiptNumber, setEkhajanaReceiptNumber] = useState("");
  const [ekhajanaPrice, setEkhajanaPrice] = useState(0);
  const [subDivCode, setSubDivCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [circleCode, setCircleCode] = useState("");
  const [mouzaCode, setMouzaCode] = useState("");
  const [lotNo, setLotNo] = useState("");
  const [pattaType, setPattaType] = useState("");
  const [pattaNo, setPattaNo] = useState("");
  const [villTownprtCode, setVillTownprtCode] = useState("");
  const [pattaTypeData, setPattaTypeData] = useState("");
  const [districtData, setDistrictData] = useState([]);
  const [subDivData, setSubDivData] = useState([]);
  const [circleData, setCircleData] = useState([]);
  const [mouzaData, setMouzaData] = useState([]);
  const [lotData, setLotData] = useState([]);
  const [villageData, setVillageData] = useState([]);
  const [pattaNoData, setPattaNoData] = useState([]);
  const [dagData, setDagData] = useState([]);
  const [selectedDagDetails, setSelectedDagDetails] = useState({ areaB: '', areaL: '', areaK: '' });
  const [pattadarData, setPattadarData] = useState([]);
  const [applicationResponse, setApplicationResponse] = useState("");
  const [submittedFormValues, setSubmittedFormValues] = useState<ModalFormData | null>(null);
  const formSubmittedRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    getDistricts();
  }, []);

  const getDistricts = async () => {
    const controller = new AbortController();
    setLoading(true);

    try {
      const response = await api.post("/get-districts", {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setDistrictData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
    return () => controller.abort(); // Cleanup on unmount
  };

  const getPattadarList = async () => {
    const controller = new AbortController();

    const postData = {
      dist_code: districtCode,
      subdiv_code: subDivCode,
      cir_code: subDivCode,
      mouza_pargona_code: mouzaCode,
      lot_no: lotNo,
      vill_townprt_code: villTownprtCode,
      patta_no: pattaNo,
      patta_type_code: pattaType
    };

    try {
      const response = await api.post("/get-pattadar-list", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setPattadarData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setFieldLoading(null);
      setLoading(false);
      // console.log('Pattadar Data', pattadarData);
    }
    return () => controller.abort(); // Cleanup on unmount
  };

  const handleDistrictChange = async (value: string) => {
    const controller = new AbortController();
    setDistrictCode(value);
    setFieldLoading('subDiv');
    const postData = { dist_code: value };

    try {
      const response = await api.post("/get-subdivs", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setSubDivData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setFieldLoading(null);
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const handleSubDivChange = async (value: string) => {
    const controller = new AbortController();
    setSubDivCode(value);
    setFieldLoading('circle');
    const postData = { dist_code: districtCode, subdiv_code: value };

    try {
      const response = await api.post("/get-circles", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setCircleData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setFieldLoading(null);
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const handleCircleChange = async (value: string) => {
    const controller = new AbortController();
    setCircleCode(value);
    setFieldLoading('mouza');
    const postData = { dist_code: districtCode, subdiv_code: subDivCode, cir_code: value };

    try {
      const response = await api.post("/get-mouzas", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setMouzaData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setFieldLoading(null);
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const handleMouzaChange = async (value: string) => {
    const controller = new AbortController();
    setMouzaCode(value);
    setFieldLoading('lot');
    const postData = { dist_code: districtCode, subdiv_code: subDivCode, cir_code: circleCode, mouza_pargona_code: value };

    try {
      const response = await api.post("/get-lots", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setLotData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setFieldLoading(null);
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const handleLotChange = async (value: string) => {
    const controller = new AbortController();
    setLotNo(value);
    setFieldLoading('village');
    const postData = { dist_code: districtCode, subdiv_code: subDivCode, cir_code: circleCode, mouza_pargona_code: mouzaCode, lot_no: value };

    try {
      const response = await api.post("/get-vills", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setVillageData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setFieldLoading(null);
      setLoading(false);
    }
    return () => controller.abort(); // Cleanup on unmount
  }

  const handlePattaTypeChange = async (value: string) => {
    const controller = new AbortController();
    setPattaType(value);
    setFieldLoading('pattaNumber');

    // Clear dependent fields when patta type changes
    setModalValue('pattaNumber', "");
    setModalValue('dagNumber', "");
    setModalValue('pattadarId', "");
    setPattaNoData([]);
    setDagData([]);
    setPattadarData([]);

    const postData = { dist_code: districtCode, subdiv_code: subDivCode, cir_code: circleCode, mouza_pargona_code: mouzaCode, lot_no: lotNo, vill_townprt_code: villTownprtCode, patta_type_code: value };

    try {
      const response = await api.post("/get-pattanos", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setPattaNoData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setFieldLoading(null);
      setLoading(false);
    }
    return () => controller.abort(); // Cleanup on unmount
  }

  const handleSelectChange = (value: string) => {
    const selectedDag = dagData.find(item => item.dag_no === value);
    if (selectedDag) {
      setAreaTableData([{
        bigha: selectedDag.dag_area_b || 0,
        lessa: selectedDag.dag_area_l || 0,
        katha: selectedDag.dag_area_k || 0,
      }]);

      setFieldLoading('pattadar');
      getPattadarList();
    }
  };

  const handlePattaDarChange = (value: string) => {
    // Handle pattadar change if needed
    // This function is called when pattadar is selected
  };

  const handlePattaNoChange = async (value: string) => {
    const controller = new AbortController();
    setPattaNo(value);
    setFieldLoading('dagNumber');

    // Clear dependent fields when patta number changes
    setModalValue('dagNumber', "");
    setModalValue('pattadarId', "");
    setDagData([]);
    setPattadarData([]);

    const postData = { dist_code: districtCode, subdiv_code: subDivCode, cir_code: circleCode, mouza_pargona_code: mouzaCode, lot_no: lotNo, vill_townprt_code: villTownprtCode };

    try {
      const response = await api.post("/get-dags", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setDagData(response?.data?.data?.data || []);
        getEkhajanaReceiptNumber();
      }
    } catch (err) {
      setError(true);
    } finally {
      setFieldLoading(null);
      setLoading(false);
    }
    return () => controller.abort(); // Cleanup on unmount
  }

  const getEkhajanaReceiptNumber = async () => {
    const controller = new AbortController();

    // const postData = {
    //   dist_code: districtCode,
    //   subdiv_code: subDivCode,
    //   cir_code: circleCode,
    //   mouza_pargona_code: mouzaCode,
    //   lot_no: lotNo,
    //   vill_townprt_code: villTownprtCode,
    //   patta_type_code: pattaType,
    //   patta_no: pattaNo,
    // };
    const postData = {
      dist_code: "25",
      subdiv_code: "01",
      cir_code: "03",
      mouza_pargona_code: "02",
      lot_no: "13",
      vill_townprt_code: "10001",
      patta_type_code: "0216",
      patta_no: "1",
    };

    try {
      const response = await api.post("/get-ekhajana-receipt-number", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setEkhajanaReceiptNumber(true);
      }
    } catch (err) {
      console.log('Pattadar Response:', err.response.data.data.msg);
      setEkhajanaReceiptNumber(false);
      await getEkhajanaAmount();
      setError(true);
    } finally {
      setLoading(false);
    }

    // api.post(
    //   'http://127.0.0.1:8000/api/get-ekhajana-receipt-number',
    //   postData,                         // ✅ data
    //   { signal: controller.signal }     // ✅ config
    // )
    //   .then(res => {
    //     console.log('Pattadar Response:', res.data.data.responseType);
    //   })
    //   .catch(err => {
    //     console.log('Pattadar Response:', err.response.data.data);
    //   });

    return () => controller.abort(); // cleanup
  };

  const getEkhajanaAmount = async () => {
    const controller = new AbortController();

    // const postData = {
    //   dist_code: districtCode,
    //   subdiv_code: subDivCode,
    //   cir_code: circleCode,
    //   mouza_pargona_code: mouzaCode,
    //   lot_no: lotNo,
    //   vill_townprt_code: villTownprtCode,
    //   patta_type_code: pattaType,
    //   patta_no: pattaNo,
    // };
    const postData = {
      dist_code: "08",
      subdiv_code: "01",
      cir_code: "05",
      mouza_pargona_code: "01",
      lot_no: "02",
      vill_townprt_code: "10007",
      patta_type_code: "0230",
      patta_no: "15",
    };

    try {
      const response = await api.post("/get-ekhajana", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );
      console.log('Ekhajana Response Success:', response.data.data.data[0]);
      if (response?.data?.data?.status == 'y') {
        const ekhajanaData = response?.data?.data?.data[0];
        const totalEkhajanaPrice = parseFloat(ekhajanaData.dag_revenue) + parseFloat(ekhajanaData.dag_local_tax);
        setEkhajanaPrice(totalEkhajanaPrice || 0);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // cleanup
  };

  const { control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      district: '',
      subDivCode: "",
      circle: '',
      mouza: '',
      lot: '',
      villageType: '',
    },
    mode: 'onChange',
  });

  const { control: modalControl, handleSubmit: handleModalSubmit, watch: watchModal, formState: { errors: modalErrors }, reset: resetModal, setValue: setModalValue } = useForm<ModalFormData>({
    defaultValues: {
      pattadarId: "",
      pattaType: "",
      pattaNumber: "",
      dagNumber: "",
      bigha: "",
      lessa: "",
      katha: "",
    },
    mode: 'onChange',
  });

  const watchModalValues = watchModal();
  const allModalFieldsSelected = watchModalValues.pattaType && watchModalValues.pattaNumber && watchModalValues.dagNumber;

  // Cascading enable/disable logic
  const isPattaNumberDisabled = !watchModalValues.pattaType;
  const isDagNumberDisabled = !watchModalValues.pattaNumber;
  const isPattadarDisabled = !watchModalValues.dagNumber;

  // Scroll to first error field when validation errors occur after form submission
  useEffect(() => {
    if (formSubmittedRef.current && Object.keys(modalErrors).length > 0 && modalOpen) {
      // Find the first error field
      const errorFieldNames = Object.keys(modalErrors);
      const firstErrorFieldName = errorFieldNames[0];

      // Map field names to their corresponding elements
      const fieldSelectors: { [key: string]: string } = {
        pattaType: '[name="pattaType"]',
        pattaNumber: '[name="pattaNumber"]',
        dagNumber: '[name="dagNumber"]',
        pattadarId: '[name="pattadarId"]',
        landPhoto: '#land-photo-upload',
        bigha: '[name="bigha"]',
        lessa: '[name="lessa"]',
        katha: '[name="katha"]',
      };

      const selector = fieldSelectors[firstErrorFieldName];
      if (selector) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          const errorElement = document.querySelector(selector);
          const modalBody = document.querySelector('.modal-body');

          if (errorElement && modalBody) {
            // Find the closest FormControl or parent container
            const formControl = errorElement.closest('.modal-form-field') ||
              errorElement.closest('.upload-photo-container') ||
              errorElement.closest('.land-area-field')?.parentElement;

            if (formControl) {
              // Scroll the modal body to the error field
              formControl.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }
        }, 100);
      }

      // Reset the ref after scrolling
      formSubmittedRef.current = false;
    }
  }, [modalErrors, modalOpen]);

  const watchedValues = watch();
  const allFieldsSelected =
    watchedValues.district &&
    watchedValues.subDistrict &&
    watchedValues.circle &&
    watchedValues.mouza &&
    watchedValues.lot &&
    watchedValues.villageType;

  const handleProceedClick = async (value) => {
    // If there are preserved form values from a previous error, restore them instead of resetting
    if (submittedFormValues) {
      // Restore the form values
      setModalValue('pattaType', submittedFormValues.pattaType || "");
      setModalValue('pattaNumber', submittedFormValues.pattaNumber || "");
      setModalValue('dagNumber', submittedFormValues.dagNumber || "");
      setModalValue('pattadarId', submittedFormValues.pattadarId || "");
      setModalValue('bigha', submittedFormValues.bigha || 0);
      setModalValue('lessa', submittedFormValues.lessa || 0);
      setModalValue('katha', submittedFormValues.katha || 0);
      if (submittedFormValues.landPhoto) {
        setModalValue('landPhoto', submittedFormValues.landPhoto);
      }
    } else {
      // Only reset if there are no preserved values
      resetModal();
    }

    const controller = new AbortController();
    const postData = { dist_code: districtCode };
    setVillTownprtCode(value);
    setButtonLoading(value);
    console.log("postData: ", postData);
    try {
      const response = await api.post("/get-pattatypes-landclasses", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );
      console.log("response: ", response?.data);
      if (response?.data?.data?.status == 'y') {
        setPattaTypeData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setButtonLoading(null);
      setModalOpen(true);
    }

    return () => controller.abort(); // Cleanup on unmount
  };

  const handleCloseModal = () => {
    // If there's an error and the error modal is showing, show the form again instead of closing
    if (error && isModalProceedClicked) {
      setIsModalProceedClicked(false);
      setSubmitLoading(false);
      // Keep modal open and error state, so user can fix and resubmit
      return;
    }

    // If there was an error and form values haven't changed, preserve them
    if (error && submittedFormValues) {
      const currentFormValues = watchModalValues;

      // Compare file objects by name and size (if both are files)
      const landPhotoChanged =
        (currentFormValues.landPhoto instanceof File && submittedFormValues.landPhoto instanceof File)
          ? currentFormValues.landPhoto.name !== submittedFormValues.landPhoto.name ||
          currentFormValues.landPhoto.size !== submittedFormValues.landPhoto.size
          : currentFormValues.landPhoto !== submittedFormValues.landPhoto;

      const valuesChanged =
        currentFormValues.pattaType !== submittedFormValues.pattaType ||
        currentFormValues.pattaNumber !== submittedFormValues.pattaNumber ||
        currentFormValues.dagNumber !== submittedFormValues.dagNumber ||
        currentFormValues.pattadarId !== submittedFormValues.pattadarId ||
        currentFormValues.bigha !== submittedFormValues.bigha ||
        currentFormValues.katha !== submittedFormValues.katha ||
        currentFormValues.lessa !== submittedFormValues.lessa ||
        landPhotoChanged;

      // Only reset if values have changed
      if (valuesChanged) {
        resetModal();
        setSubmittedFormValues(null); // Clear stored values if they changed
      }
      // If values haven't changed, keep submittedFormValues so we can restore them later
    } else {
      // Reset normally if no error or no submitted values stored
      resetModal();
      setSubmittedFormValues(null);
    }

    setIsModalProceedClicked(false);
    setModalOpen(false);
    setSubmitLoading(false);
    setError(false); // Reset error state when closing modal
    formSubmittedRef.current = false; // Reset form submission ref
  };

  // console.log("areaTableData: ", areaTableData);

  const onModalSubmit = async (data: ModalFormData) => {
    setSubmitLoading(true);
    setError(false);
    formSubmittedRef.current = false; // Reset ref on successful validation
    // Store form values before submission to compare later
    setSubmittedFormValues({ ...data });
    const controller = new AbortController();

    const extraData = {
      dist_code: districtCode,
      subdiv_code: subDivCode,
      cir_code: circleCode,
      mouza_pargona_code: mouzaCode,
      lot_no: lotNo,
      vill_townprt_code: villTownprtCode,
      dag_area_b: areaTableData[0].bigha,
      dag_area_k: areaTableData[0].katha,
      dag_area_lc: areaTableData[0].lessa,
      land_class_code: '1'
    };

    const finalData = { ...data, ...extraData };

    const formData = new FormData();

    // append all normal fields
    Object.entries(finalData).forEach(([key, value]) => {
      if (key !== 'landPhoto') {
        formData.append(key, value as any);
      }
    });

    // IMPORTANT: map landPhoto → land_photo
    if (finalData.landPhoto) {
      formData.append('land_photo', finalData.landPhoto);
    }

    console.log('Final submission data:', finalData);
    console.log('FILE →', formData.get('land_photo'));

    try {
      const response = await api.post("/store-application",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: controller.signal
        },
      );

      console.log("err?.response?: ", response?.data?.data?.message);
      setApplicationResponse(response?.data?.data?.message);

    } catch (err: any) {
      setError(true);
      console.log("Error response: ", err?.response);
      setApplicationResponse(err?.response?.data?.data?.message || "Failed to submit application. Please try again.");
    } finally {
      setEkhajanaPrice(0);
      setLoading(false);
      setIsModalProceedClicked(true);
    }

    return () => controller.abort(); // Cleanup on unmount
  };

  console.log("ekhajanaPrice: ", ekhajanaPrice);

  if (loading) {
    return <Loader type="fullPage" />;
  }

  const id = 5;

  return (
    <div className="form-container">
      <div className="form-title">Fill All The Details</div>

      <div className="form-fields">
        <div className="form-row">
          <Controller
            name="district"
            control={control}
            rules={{ required: 'District is required' }}
            render={({ field }) => (
              <FormControl className="form-field" error={!!errors.district} sx={{ position: 'relative' }}>
                <InputLabel>Select District</InputLabel>
                <Select
                  {...field}
                  label="Select District"
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handleDistrictChange(e.target.value)
                    }
                  }
                >
                  {
                    Object.entries(districtData)?.map(([key, district]) => {
                      return <MenuItem key={key} value={key}>{district}</MenuItem>
                    })
                  }
                </Select>
                {errors.district && (
                  <FormHelperText>{errors.district.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="subDivCode"
            control={control}
            rules={{ required: 'Sub-district is required' }}
            render={({ field }) => (
              <FormControl className="form-field" error={!!errors.subDivCode} sx={{ position: 'relative' }}>
                <InputLabel>Sub-Division</InputLabel>
                <Select
                  {...field}
                  label="Sub-Division"
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handleSubDivChange(e.target.value)
                    }
                  }
                >
                  {
                    subDivData?.map((item, key) => {
                      return <MenuItem key={key} value={item.subdiv_code}>{item.loc_name}</MenuItem>
                    })
                  }
                </Select>
                {errors.subDivCode && (
                  <FormHelperText>{errors.subDivCode.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="circle"
            control={control}
            rules={{ required: 'Circle is required' }}
            render={({ field }) => (
              <FormControl className="form-field" error={!!errors.circle} sx={{ position: 'relative' }}>
                <InputLabel>Circle</InputLabel>
                <Select
                  {...field}
                  label="Circle"
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handleCircleChange(e.target.value)
                    }
                  }
                >
                  {
                    circleData?.map((item, key) => {
                      return <MenuItem key={key} value={item.cir_code}>{item.loc_name}</MenuItem>
                    })
                  }
                </Select>
                {errors.circle && (
                  <FormHelperText>{errors.circle.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>

        <div className="form-row">
          <Controller
            name="mouza"
            control={control}
            rules={{ required: 'Mouza is required' }}
            render={({ field }) => (
              <FormControl className="form-field" error={!!errors.mouza} sx={{ position: 'relative' }}>
                <InputLabel>Mouza</InputLabel>
                <Select
                  {...field}
                  label="Mouza"
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handleMouzaChange(e.target.value)
                    }
                  }
                >
                  {
                    mouzaData?.map((item, key) => {
                      return <MenuItem key={key} value={item.mouza_code}>{item.loc_name}</MenuItem>
                    })
                  }
                </Select>
                {errors.mouza && (
                  <FormHelperText>{errors.mouza.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="lot"
            control={control}
            rules={{ required: 'Lot is required' }}
            render={({ field }) => (
              <FormControl className="form-field" error={!!errors.lot} sx={{ position: 'relative' }}>
                <InputLabel>Lot</InputLabel>
                <Select
                  {...field}
                  label="Lot"
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handleLotChange(e.target.value)
                    }
                  }
                >
                  {
                    lotData?.map((item, key) => {
                      return <MenuItem key={key} value={item.lot_no}>{item.loc_name}</MenuItem>
                    })
                  }
                </Select>
                {errors.lot && (
                  <FormHelperText>{errors.lot.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
      </div>

      {villageData.length > 0 ? (
        <div className="table-section">
          <Table
            columns={[
              {
                header: 'Sr. No.',
                render: (_row, index) => index + 1
              },
              { header: 'Village Name', accessor: 'loc_name' },
              {
                header: 'Action',
                render: (row) => (
                  <Button
                    className="action-button"
                    onClick={() => handleProceedClick(row.village_code)}
                    disabled={buttonLoading === row.village_code}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    {row.action}
                    {buttonLoading === row.village_code ? (
                      <Loader type="button" size={16} />
                    ) : (
                      <img src={rightArrowIcon} alt="right arrow" className="action-icon" />
                    )}
                  </Button>
                )
              }
            ]}
            data={villageData}
            className="table-container"
          />
        </div>
      )
        : (
          <div className="map-placeholder">
            <div className="map-dot">
              <img src={mapInfoIcon} alt="map-dot" />
            </div>
            <div className="map-text">Please select the required fields to view the map</div>
          </div>
        )}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Land Area Information"
        onSubmit={!isModalProceedClicked ? (e) => {
          formSubmittedRef.current = true;
          handleModalSubmit(onModalSubmit)(e);
        } : undefined}
        customFooter={
          <Button
            type={isModalProceedClicked ? "button" : "submit"}
            className={isModalProceedClicked ? "modal-close-button" : "modal-proceed-button"}
            fullWidth
            disabled={submitLoading}
            onClick={isModalProceedClicked ? handleCloseModal : undefined}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
          >
            {submitLoading ? (
              <>
                <Loader type="button" size={20} />
                <span>Submitting...</span>
              </>
            ) : (
              !isModalProceedClicked ? 'Proceed' : 'CLOSE'
            )}
          </Button>
        }
      >
        {!isModalProceedClicked && <div className="modal-form-fields">
          <Controller
            name="pattaType"
            control={modalControl}
            rules={{ required: 'Patta Type is required' }}
            render={({ field }) => (
              <FormControl className="modal-form-field" error={!!modalErrors.pattaType} fullWidth sx={{ position: 'relative' }}>
                <InputLabel>Patta Type</InputLabel>
                <Select
                  {...field}
                  label="Patta Type"
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handlePattaTypeChange(e.target.value)
                    }
                  }
                >
                  {
                    pattaTypeData?.patta_types?.map((item, key) => {
                      return <MenuItem key={key} value={item.type_code}>{item.patta_type}</MenuItem>
                    })
                  }
                </Select>
                {modalErrors.pattaType && (
                  <FormHelperText>{modalErrors.pattaType.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="pattaNumber"
            control={modalControl}
            rules={{ required: 'Patta Number is required' }}
            render={({ field }) => (
              <FormControl className="modal-form-field" error={!!modalErrors.pattaNumber} fullWidth sx={{ position: 'relative' }}>
                <InputLabel>Patta No.</InputLabel>
                <Select
                  {...field}
                  label="Patta Number"
                  disabled={isPattaNumberDisabled}
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handlePattaNoChange(e.target.value)
                    }
                  }
                >
                  {
                    pattaNoData?.map((item, key) => {
                      return <MenuItem key={key} value={item.patta_no}>{item.patta_no}</MenuItem>
                    })
                  }
                </Select>
                {modalErrors.pattaNumber && (
                  <FormHelperText>{modalErrors.pattaNumber.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="dagNumber"
            control={modalControl}
            rules={{ required: 'Dag Number is required' }}
            render={({ field }) => (
              <FormControl className="modal-form-field" error={!!modalErrors.dagNumber} fullWidth sx={{ position: 'relative' }}>
                <InputLabel>Dag No.</InputLabel>
                <Select
                  {...field}
                  label="Dag Number"
                  disabled={isDagNumberDisabled}
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handleSelectChange(e.target.value)
                    }
                  }
                >
                  {
                    dagData?.map((item, key) => {
                      return <MenuItem key={key} value={item.dag_no}>{item.dag_no}</MenuItem>
                    })
                  }
                </Select>
                {modalErrors.dagNumber && (
                  <FormHelperText>{modalErrors.dagNumber.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="pattadarId"
            control={modalControl}
            rules={{ required: 'Pattadar Number is required' }}
            render={({ field }) => (
              <FormControl className="modal-form-field" error={!!modalErrors.pattadarId} fullWidth>
                <InputLabel>Pattadar</InputLabel>
                <Select
                  {...field}
                  label="Pattadar"
                  disabled={isPattadarDisabled}
                  onChange={
                    (e) => {
                      field.onChange(e);
                      // handlePattaDarChange(e.target.value ?? '')
                    }
                  }
                >
                  {
                    pattadarData?.map((item, key) => {
                      return <MenuItem key={key} value={item.pdar_id}>{item.pdar_name}</MenuItem>
                    })
                  }
                </Select>
                {modalErrors.pattadarId && (
                  <FormHelperText>{modalErrors.pattadarId.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

        </div>
        }

        {!isModalProceedClicked && (
          <>
            {/* Upload Land Photo Section */}
            <div className="upload-photo-section">
              <Controller
                name="landPhoto"
                control={modalControl}
                rules={{ required: 'Land photo is required' }}
                render={({ field }) => (
                  <Box className="upload-photo-container">
                    <label htmlFor="land-photo-upload" className="upload-photo-label">
                      <input
                        id="land-photo-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                      <Box
                        className={`upload-photo-button ${modalErrors.landPhoto ? 'upload-photo-button-error' : ''}`}
                        component="div"
                        sx={{
                          ...(modalErrors.landPhoto && {
                            border: '2px dashed #d32f2f',
                            borderColor: '#d32f2f',
                          }),
                        }}
                      >
                        {field.value && field.value instanceof File ? (
                          <Box className="upload-photo-preview">
                            <ImageIcon sx={{ fontSize: 36, color: '#728fd9' }} />
                            <Box className="upload-photo-info">
                              <Box className="upload-photo-name">{field.value.name}</Box>
                              <Box className="upload-photo-size">
                                {(field.value.size / 1024 / 1024).toFixed(2)} MB
                              </Box>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                field.onChange(null);
                                const input = document.getElementById('land-photo-upload') as HTMLInputElement;
                                if (input) input.value = '';
                              }}
                              sx={{
                                mt: 0.5,
                                textTransform: 'none',
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                                '&:hover': {
                                  borderColor: '#d32f2f',
                                  backgroundColor: 'rgba(211, 47, 47, 0.04)'
                                }
                              }}
                            >
                              Remove
                            </Button>
                          </Box>
                        ) : (
                          <Box className="upload-photo-placeholder">
                            <CloudUploadIcon sx={{ fontSize: 36, color: '#728fd9', mb: 0.5 }} />
                            <Box className="upload-photo-text">
                              <Box className="upload-photo-title">Upload Land Photo</Box>
                              <Box className="upload-photo-subtitle">Click to browse or drag and drop</Box>
                              <Box className="upload-photo-hint">Supports: JPG, PNG, GIF (Max 10MB)</Box>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </label>
                    {modalErrors.landPhoto && (
                      <FormHelperText error sx={{ mt: 1, ml: 1 }}>
                        {modalErrors.landPhoto.message}
                      </FormHelperText>
                    )}
                  </Box>
                )}
              />
            </div>

            {
              ekhajanaPrice > 0 && (
                <div className="ekhajana-info">
                  <div className="ekhajana-text">
                    Ekhajana Amount to be paid: ₹ {ekhajanaPrice.toFixed(2)}
                  </div>
                </div>
              )
            }
          </>
        )}


        {!allModalFieldsSelected || areaTableData.length == 0 && <div className="modal-separator"></div>}

        {
          !isModalProceedClicked ? (
            allModalFieldsSelected && areaTableData.length > 0 ? (
              <>
                <div className="area-table">
                  <Table
                    title="Area Information"
                    columns={[
                      { header: 'Bigha', accessor: 'bigha' },
                      { header: 'Katha', accessor: 'katha' },
                      { header: 'Lessa', accessor: 'lessa' }
                    ]}
                    data={areaTableData}
                    className="table-container"
                  />
                </div>
                <div className="new-land-area-container">
                  <div className="title">Enter New Land Area</div>
                  <div className="land-area-fields">
                    <Controller
                      name="bigha"
                      control={modalControl}
                      rules={{ required: 'Bigha is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Bigha"
                          type="number"
                          className="land-area-field"
                          error={!!modalErrors.bigha}
                          helperText={modalErrors.bigha?.message}
                          fullWidth
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="katha"
                      control={modalControl}
                      rules={{ required: 'Katha is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Katha"
                          type="number"
                          className="land-area-field"
                          error={!!modalErrors.katha}
                          helperText={modalErrors.katha?.message}
                          fullWidth
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="lessa"
                      control={modalControl}
                      rules={{ required: 'Lessa is required' }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Lessa"
                          type="number"
                          className="land-area-field"
                          error={!!modalErrors.lessa}
                          helperText={modalErrors.lessa?.message}
                          fullWidth
                          onChange={(e) => {
                            const value = e.target.value === '' ? '' : Number(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                  </div>

                  <DetailsButton onClick={() => navigate(`/application-details/${id}`)}>
                    View Application Details
                  </DetailsButton>


                </div>
              </>
            ) : (
              <div className="error-message-container">
                <div className="error-icon">
                  <img src={errorIcon} alt="error" />
                </div>
                <div className="error-text">No Data available</div>
              </div>
            ))

            : (
              <div className={error ? 'error-container' : 'success-container'}>
                {error ? (
                  <>
                    <ErrorOutlineIcon sx={{ fontSize: 80, color: '#d32f2f' }} />
                    <div className="text error-text">{applicationResponse}</div>
                  </>
                ) : (
                  <>
                    <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#4caf50' }} />
                    <div className="text success-text">{applicationResponse}</div>
                  </>
                )}
              </div>
            )
        }

      </Modal>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={fieldLoading !== null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default CitizenApplication;



/*
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<button onClick={() => navigate('/application-details')}>
  Go to Details
</button>

*/