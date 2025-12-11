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
  dagNumber:number | null
  bigha: number | null
  lessa: number | null
  katha: number | null
}

const areaTableData = [{bigha:0,lessa:12,katha:12}];

const CitizenApplication = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [districtData, setDistrictData] = useState([]);
  const [subDivData, setSubDivData] = useState([]);

  useEffect(() => {
    getDistricts();
  }, []);

  const getDistricts = async () => {
    const controller = new AbortController();

    try {
      const response = await api.post("/get-districts", {
        signal: controller.signal }, // Attach the signal to the request
      );
      console.log("Districts response:", response);
      if(response?.data?.data?.status == 'y'){
        setDistrictData(response?.data?.data?.data || []);
      }
    } catch (err) {
        setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
    return () => controller.abort(); // Cleanup on unmount
  };

  const handleDistrictChange = async (value: string) => {
    const controller = new AbortController();
    const postData = { dist_code: value };

    try {
      const response = await api.post("/get-subdivs", postData, {
        signal: controller.signal }, // Attach the signal to the request
      );
      console.log("Districts response:", response);
      if(response?.data?.data?.status == 'y'){
        setSubDivData(response?.data?.data?.data || []);
      }
    } catch (err) {
        setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // Cleanup on unmount
  }

  const { control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      district: '',
      subDistrict: '',
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

  // Mock data for table - replace with actual API call
  const tableData = allFieldsSelected ? [

  ] : [];

  const handleProceedClick = () => {
    resetModal();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetModal();
  };

  const onModalSubmit = (data: ModalFormData) => {
    console.log('Modal form data:', data);
    // Handle modal form submission here
    handleCloseModal();
  };
  
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
                  onChange={(e) => handleDistrictChange(e.target.value)}
                >
                  {
                    Object.entries(districtData)?.map(([key, district]) => {
                      return <MenuItem  key={key} value={ key }>{ district }</MenuItem>
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
            name="subDistrict"
            control={control}
            rules={{ required: 'Sub-district is required' }}
            render={({ field }) => (
              <FormControl className="form-field" error={!!errors.subDistrict}>
                <InputLabel>Sub-district</InputLabel>
                <Select 
                  {...field}
                  label="Sub-district"
                >
                  {
                    subDivData?.map((item, key) => {
                      return <MenuItem key={key} value={item.subdiv_code}>{item.loc_name}</MenuItem>
                    })
                  }
                </Select>
                {errors.subDistrict && (
                  <FormHelperText>{errors.subDistrict.message}</FormHelperText>
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
                >
                  <MenuItem value="circle1">Circle 1</MenuItem>
                  <MenuItem value="circle2">Circle 2</MenuItem>
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
                >
                  <MenuItem value="mouza1">Mouza 1</MenuItem>
                  <MenuItem value="mouza2">Mouza 2</MenuItem>
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
                >
                  <MenuItem value="lot1">Lot 1</MenuItem>
                  <MenuItem value="lot2">Lot 2</MenuItem>
                </Select>
                {errors.lot && (
                  <FormHelperText>{errors.lot.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          
          <Controller
            name="villageType"
            control={control}
            rules={{ required: 'Village Type is required' }}
            render={({ field }) => (
              <FormControl className="form-field" error={!!errors.villageType}>
                <InputLabel>Village Type</InputLabel>
                <Select 
                  {...field}
                  label="Village Type"
                >
                  <MenuItem value="type1">Type 1</MenuItem>
                  <MenuItem value="type2">Type 2</MenuItem>
                </Select>
                {errors.villageType && (
                  <FormHelperText>{errors.villageType.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
      </div>
      
      {allFieldsSelected ? (
        <div className="table-section">
          <Table
            columns={[
              { 
                header: 'Sr. No.',
                render: (_row, index) => index + 1
              },
              { header: 'Village Name', accessor: 'villageName' },
              { header: 'Mouza', accessor: 'mouza' },
              {
                header: 'Action',
                render: (row) => (
                  <Button 
                    className="action-button"
                    onClick={handleProceedClick}
                  >
                    {row.action}
                    <img src={rightArrowIcon} alt="right arrow" className="action-icon" />
                  </Button>
                )
              }
            ]}
            data={tableData}
            className="table-container"
          />
        </div>
      )
      :(
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
        onSubmit={handleModalSubmit(onModalSubmit)}
      >
        <div className="modal-form-fields">
          <Controller
            name="pattaType"
            control={modalControl}
            rules={{ required: 'Patta Type is required' }}
            render={({ field }) => (
              <FormControl className="modal-form-field" error={!!modalErrors.pattaType} fullWidth>
                <InputLabel>Village Type</InputLabel>
                <Select 
                  {...field}
                  label="Patta Type"
                >
                  <MenuItem value="pata-type-1">Pata Type 1</MenuItem>
                  <MenuItem value="pata-type-2">Pata Type 2</MenuItem>
                  <MenuItem value="pata-type-3">Pata Type 3</MenuItem>
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
                <InputLabel>Plot Number</InputLabel>
                <Select 
                  {...field}
                  label="Patta Number"
                >
                  <MenuItem value="12">12</MenuItem>
                  <MenuItem value="13">13</MenuItem>
                  <MenuItem value="14">14</MenuItem>
                  <MenuItem value="15">15</MenuItem>
                  <MenuItem value="16">16</MenuItem>
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
                <InputLabel>Thana/Mandal</InputLabel>
                <Select 
                  {...field}
                  label="Dag Number"
                >
                  <MenuItem value="thana-1">Thana 1</MenuItem>
                  <MenuItem value="thana-2">Thana 2</MenuItem>
                  <MenuItem value="mandal-1">Mandal 1</MenuItem>
                  <MenuItem value="mandal-2">Mandal 2</MenuItem>
                </Select>
                {modalErrors.dagNumber && (
                  <FormHelperText>{modalErrors.dagNumber.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>
 
        {!allModalFieldsSelected || areaTableData.length ==0 && <div className="modal-separator"></div>}

        {
            allModalFieldsSelected && areaTableData.length > 0 && (
                <>
                <div className="area-table">
                    <Table
                        title="Area Information"
                        columns={[
                            { header: 'Bigha', accessor: 'bigha' },
                            { header: 'Lessa', accessor: 'lessa' },
                            { header: 'Katha', accessor: 'katha' }
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
            )
        }

      </Modal>
    </div>
  );
};

export default CitizenApplication;

