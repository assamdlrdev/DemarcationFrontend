import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, MenuItem, FormControl, InputLabel, Button, FormHelperText, TextField } from '@mui/material';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import './style.scss';
import mapInfoIcon from '../../../public/svg/info.svg';
import rightArrowIcon from '../../../public/svg/icon right.svg';
import axios from 'axios';
import api from "../../api/axios"; 
import errorIcon from '../../../public/svg/empty-img-gray.svg';
import Loader from '../../components/Loader';

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
  bigha: number | null
  lessa: number | null
  katha: number | null
}

const CitizenApplication = () => {
  const [isModalProceedClicked,setIsModalProceedClicked] = useState(false);
  const [areaTableData, setAreaTableData] = useState([{ bigha: 0, lessa: 0, katha: 0 }]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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



  useEffect(() => {
    getDistricts();
  }, []);

  const getDistricts = async () => {
    const controller = new AbortController();

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
      // setLoading(false);
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
      setLoading(false);
      // console.log('Pattadar Data', pattadarData);
    }
    return () => controller.abort(); // Cleanup on unmount
  };

  const handleDistrictChange = async (value: string) => {
    const controller = new AbortController();
    setDistrictCode(value);
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
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const handleSubDivChange = async (value: string) => {
    const controller = new AbortController();
    setSubDivCode(value);
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
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const handleCircleChange = async (value: string) => {
    const controller = new AbortController();
    setCircleCode(value);
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
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const handleMouzaChange = async (value: string) => {
    const controller = new AbortController();
    setMouzaCode(value);
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
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const handleLotChange = async (value: string) => {
    const controller = new AbortController();
    setLotNo(value);
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
      setLoading(false);
    }
    return () => controller.abort(); // Cleanup on unmount
  }

  const handlePattaTypeChange = async (value: string) => {
    const controller = new AbortController();
    setPattaType(value);
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

      getPattadarList();
    }
  };

  const handlePattaNoChange = async (value: string) => {
    const controller = new AbortController();
    setPattaNo(value);
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
      subDivCode: '',
      circle: '',
      mouza: '',
      lot: '',
      villageType: '',
    },
    mode: 'onChange',
  });

  const { control: modalControl, handleSubmit: handleModalSubmit, watch: watchModal, formState: { errors: modalErrors }, reset: resetModal } = useForm<ModalFormData>({
    defaultValues: {
      pattaType: '',
      pattaNumber: null,
      dagNumber: null,
      bigha: null,
      lessa: null,
      katha: null,
    },
    mode: 'onChange',
  });

  const watchModalValues = watchModal();
  const allModalFieldsSelected = watchModalValues.pattaType && watchModalValues.pattaNumber && watchModalValues.dagNumber;

  const watchedValues = watch();
  const allFieldsSelected =
    watchedValues.district &&
    watchedValues.subDistrict &&
    watchedValues.circle &&
    watchedValues.mouza &&
    watchedValues.lot &&
    watchedValues.villageType;

  const handleProceedClick = async (value) => {
    resetModal();
    const controller = new AbortController();
    const postData = { dist_code: districtCode };
    setVillTownprtCode(value);

    try {
      const response = await api.post("/get-pattatypes-landclasses", postData, {
        signal: controller.signal
      }, // Attach the signal to the request
      );

      if (response?.data?.data?.status == 'y') {
        setPattaTypeData(response?.data?.data?.data || []);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }

    setModalOpen(true);
    return () => controller.abort(); // Cleanup on unmount
  };

  const handleCloseModal = () => {
    setIsModalProceedClicked(false);
    setModalOpen(false);
    resetModal();
  };

  // console.log("areaTableData: ", areaTableData);

  const onModalSubmit = async (data: ModalFormData) => {

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

      return false;
      console.log("err?.response?: ", response?.data?.data?.message);
      setApplicationResponse(response?.data?.data?.message);
      
    } catch (err) {
      setError(true);
      console.log("err?.response?: ", err?.response);
      setApplicationResponse(err?.response?.data?.data?.message || "Failed to submit application.");
    } finally {
      setLoading(false);
      setIsModalProceedClicked(true);
    }

    return () => controller.abort(); // Cleanup on unmount
  };

  console.log("ekhajanaPrice: ", ekhajanaPrice);
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
              <FormControl className="form-field" error={!!errors.district}>
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
              <FormControl className="form-field" error={!!errors.subDivCode}>
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
              <FormControl className="form-field" error={!!errors.circle}>
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
              <FormControl className="form-field" error={!!errors.mouza}>
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
              <FormControl className="form-field" error={!!errors.lot}>
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
              { header: 'Code', accessor: 'village_code' },
              {
                header: 'Action',
                render: (row) => (
                  <Button
                    className="action-button"
                    onClick={() => handleProceedClick(row.village_code)}
                  >
                    {row.action}
                    <img src={rightArrowIcon} alt="right arrow" className="action-icon" />
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
        onSubmit={!isModalProceedClicked ? handleModalSubmit(onModalSubmit) : undefined}
        customFooter={
          <Button
            type="submit"
            className= {isModalProceedClicked ? "modal-close-button" : "modal-proceed-button"}
            fullWidth
          >
            {!isModalProceedClicked ? 'Proceed' : 'CLOSE'}
          </Button>
        }
      >
        {!isModalProceedClicked && <div className="modal-form-fields">
          <Controller
            name="pattaType"
            control={modalControl}
            rules={{ required: 'Patta Type is required' }}
            render={({ field }) => (
              <FormControl className="modal-form-field" error={!!modalErrors.pattaType} fullWidth>
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
              <FormControl className="modal-form-field" error={!!modalErrors.pattaNumber} fullWidth>
                <InputLabel>Patta No.</InputLabel>
                <Select
                  {...field}
                  label="Patta Number"
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
              <FormControl className="modal-form-field" error={!!modalErrors.dagNumber} fullWidth>
                <InputLabel>Dag No.</InputLabel>
                <Select
                  {...field}
                  label="Dag Number"
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
                  onChange={
                    (e) => {
                      field.onChange(e);
                      handlePattaDarChange(e.target.value)
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

          <Controller
            name="landPhoto"
            control={modalControl}
            rules={{ required: 'Land photo is required' }}
            render={({ field }) => (
              <FormControl className="modal-form-field" error={!!modalErrors.landPhoto} fullWidth>
                <Button variant="outlined" component="label">
                  Upload Land Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </Button>
                {field.value && (
                  <FormHelperText>{field.value.name}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
        }

        {
          ekhajanaPrice > 0 && (
            <div className="ekhajana-info">
              <div className="ekhajana-text">
                Ekhajana Amount to be paid: ₹ {ekhajanaPrice.toFixed(2)}
              </div>
            </div>
          )
        }

 
        {!allModalFieldsSelected || areaTableData.length ==0 && <div className="modal-separator"></div>}

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
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
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
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
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
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                />
                            )}
                        />
                    </div>
                </div>
                </>
            ): (
                <div className="error-message-container">
                    <div className="error-icon">
                        <img src={errorIcon} alt="error" />
                    </div>
                    <div className="error-text">No Data available</div>
                </div>
            ))
            
            : (
            <div className={error ? 'success-container' : 'success-container'}>
                <img src='../../../public/images/success.png' alt='success' />
                <div className="text">{ applicationResponse }</div>
                </div>
        )
        }

      </Modal>
    </div>
  );
};

export default CitizenApplication;

