import React, { useState, useEffect } from 'react';
import { ChevronDown, Info } from 'lucide-react';

// Parse CSV data
const parseProvinceData = () => {
  const data = [];
  
  // Create mapping for provinces with special characters that might be corrupted
  const provinceMapping = {
    "Hà Giang": "Hà Giang",
    "Cao Bằng": "Cao Bằng",
    "Lạng Sơn": "Lạng Sơn",
    "Bắc Giang": "Bắc Giang",
    "Phú Thọ": "Phú Thọ",
    "Thái Nguyên": "Thái Nguyên",
    "Bắc Kạn": "Bắc Kạn",
    "Tuyên Quang": "Tuyên Quang",
    "Lào Cai": "Lào Cai",
    "Yên Bái": "Yên Bái",
    "Lai Châu": "Lai Châu",
    "Sơn La": "Sơn La",
    "Điện Biên": "Điện Biên",
    "Hoà Bình": "Hoà Bình",
    "TP Hà Nội": "Hà Nội",
    "TP Hải Phòng": "Hải Phòng",
    "Hải Dương": "Hải Dương",
    "Hưng Yên": "Hưng Yên",
    "Vĩnh Phúc": "Vĩnh Phúc",
    "Bắc Ninh": "Bắc Ninh",
    "Thái Bình": "Thái Bình",
    "Nam Định": "Nam Định",
    "Hà Nam": "Hà Nam",
    "Ninh Bình": "Ninh Bình",
    "Quảng Ninh": "Quảng Ninh",
    "Thanh Hoá": "Thanh Hóa",
    "Nghệ An": "Nghệ An",
    "Hà Tĩnh": "Hà Tĩnh",
    "Quảng Bình": "Quảng Bình",
    "Quảng Trị": "Quảng Trị",
    "Thừa Thiên Huế": "Thừa Thiên Huế",
    "TP Đà Nẵng": "Đà Nẵng",
    "Quảng Nam": "Quảng Nam",
    "Quảng Ngãi": "Quảng Ngãi",
    "Bình Định": "Bình Định",
    "Phú Yên": "Phú Yên",
    "Khánh Hoà": "Khánh Hòa",
    "Ninh Thuận": "Ninh Thuận",
    "Bình Thuận": "Bình Thuận",
    "Kon Tum": "Kon Tum",
    "Gia Lai": "Gia Lai",
    "Đắk Lắk": "Đắk Lắk",
    "Đắk Nông": "Đắk Nông",
    "Lâm Đồng": "Lâm Đồng",
    "TP Hồ Chí Minh": "Hồ Chí Minh",
    "Đồng Nai": "Đồng Nai",
    "Bà Rịa-Vũng Tàu": "Bà Rịa - Vũng Tàu",
    "Bình Dương": "Bình Dương",
    "Bình Phước": "Bình Phước",
    "Tây Ninh": "Tây Ninh",
    "TP Cần Thơ": "Cần Thơ",
    "Long An": "Long An",
    "Tiền Giang": "Tiền Giang",
    "Bến Tre": "Bến Tre",
    "Trà Vinh": "Trà Vinh",
    "Vĩnh Long": "Vĩnh Long",
    "An Giang": "An Giang",
    "Đồng Tháp": "Đồng Tháp",
    "Kiên Giang": "Kiên Giang",
    "Hậu Giang": "Hậu Giang",
    "Sóc Trăng": "Sóc Trăng",
    "Bạc Liêu": "Bạc Liêu",
    "Cà Mau": "Cà Mau"
  };

  // Raw data from CSV
  const rawData = [
    { province: "Hà Giang", total: 475001, natural: 385688, planted: 89313, coverage: 58.58, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Cao Bằng", total: 380099, natural: 358391, planted: 21708, coverage: 56.00, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Lạng Sơn", total: 572095, natural: 255522, planted: 316573, coverage: 63.70, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Bắc Giang", total: 160223, natural: 55092, planted: 105131, coverage: 38.00, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Phú Thọ", total: 169333, natural: 47403, planted: 121930, coverage: 39.90, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Thái Nguyên", total: 165749, natural: 62452, planted: 103297, coverage: 47.06, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Bắc Kạn", total: 373597, natural: 272350, planted: 101247, coverage: 73.35, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Tuyên Quang", total: 426205, natural: 233133, planted: 193072, coverage: 65.21, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Lào Cai", total: 382861, natural: 266753, planted: 116108, coverage: 57.70, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Yên Bái", total: 463811, natural: 215913, planted: 247898, coverage: 63.00, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Lai Châu", total: 473927, natural: 450392, planted: 23534, coverage: 51.87, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Sơn La", total: 672934, natural: 594076, planted: 78858, coverage: 47.30, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Điện Biên", total: 417344, natural: 409033, planted: 8311, coverage: 43.54, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "Hoà Bình", total: 266509, natural: 141614, planted: 124895, coverage: 51.69, region: "Vùng trung du và miền núi phía Bắc" },
    { province: "TP Hà Nội", total: 19514, natural: 7587, planted: 11926, coverage: 5.59, region: "Vùng đồng bằng sông Hồng" },
    { province: "TP Hải Phòng", total: 13840, natural: 9072, planted: 4768, coverage: 8.63, region: "Vùng đồng bằng sông Hồng" },
    { province: "Hải Dương", total: 9160, natural: 2241, planted: 6919, coverage: 5.33, region: "Vùng đồng bằng sông Hồng" },
    { province: "Hưng Yên", total: 0, natural: 0, planted: 0, coverage: 0, region: "Vùng đồng bằng sông Hồng" },
    { province: "Vĩnh Phúc", total: 33357, natural: 12049, planted: 21308, coverage: 25.00, region: "Vùng đồng bằng sông Hồng" },
    { province: "Bắc Ninh", total: 556, natural: 0, planted: 556, coverage: 0.68, region: "Vùng đồng bằng sông Hồng" },
    { province: "Thái Bình", total: 4248, natural: 0, planted: 4248, coverage: 2.49, region: "Vùng đồng bằng sông Hồng" },
    { province: "Nam Định", total: 3045, natural: 0, planted: 3045, coverage: 1.78, region: "Vùng đồng bằng sông Hồng" },
    { province: "Hà Nam", total: 5578, natural: 4373, planted: 1205, coverage: 6.47, region: "Vùng đồng bằng sông Hồng" },
    { province: "Ninh Bình", total: 27892, natural: 23036, planted: 4857, coverage: 19.62, region: "Vùng đồng bằng sông Hồng" },
    { province: "Quảng Ninh", total: 370213, natural: 121872, planted: 248341, coverage: 55.00, region: "Vùng đồng bằng sông Hồng" },
    { province: "Thanh Hoá", total: 647737, natural: 393361, planted: 254376, coverage: 53.60, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Nghệ An", total: 1014075, natural: 789934, planted: 224141, coverage: 58.36, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Hà Tĩnh", total: 337231, natural: 217327, planted: 119904, coverage: 52.56, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Quảng Bình", total: 590038, natural: 469317, planted: 120722, coverage: 68.69, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Quảng Trị", total: 248122, natural: 126692, planted: 121429, coverage: 49.90, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Thừa Thiên Huế", total: 305560, natural: 205602, planted: 99958, coverage: 57.15, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "TP Đà Nẵng", total: 63044, natural: 43126, planted: 19919, coverage: 45.50, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Quảng Nam", total: 680806, natural: 463530, planted: 217276, coverage: 58.71, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Quảng Ngãi", total: 333050, natural: 106672, planted: 226378, coverage: 51.01, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Bình Định", total: 381110, natural: 214544, planted: 166567, coverage: 56.92, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Phú Yên", total: 250659, natural: 126974, planted: 123685, coverage: 45.95, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Khánh Hoà", total: 244332, natural: 176383, planted: 67949, coverage: 45.41, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Ninh Thuận", total: 160424, natural: 147420, planted: 13004, coverage: 47.11, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Bình Thuận", total: 349625, natural: 296927, planted: 52699, coverage: 43.11, region: "Vùng Bắc Trung Bộ và duyên hải miền Trung" },
    { province: "Kon Tum", total: 624660, natural: 547604, planted: 77056, coverage: 63.05, region: "Vùng Tây Nguyên" },
    { province: "Gia Lai", total: 648278, natural: 478750, planted: 169529, coverage: 40.89, region: "Vùng Tây Nguyên" },
    { province: "Đắk Lắk", total: 505557, natural: 413845, planted: 91711, coverage: 38.03, region: "Vùng Tây Nguyên" },
    { province: "Đắk Nông", total: 254359, natural: 196020, planted: 58339, coverage: 38.52, region: "Vùng Tây Nguyên" },
    { province: "Lâm Đồng", total: 538234, natural: 454534, planted: 83700, coverage: 54.44, region: "Vùng Tây Nguyên" },
    { province: "TP Hồ Chí Minh", total: 33557, natural: 13509, planted: 20049, coverage: 15.93, region: "Vùng Đông Nam Bộ" },
    { province: "Đồng Nai", total: 181376, natural: 123939, planted: 57437, coverage: 29.24, region: "Vùng Đông Nam Bộ" },
    { province: "Bà Rịa-Vũng Tàu", total: 28550, natural: 16465, planted: 12085, coverage: 13.79, region: "Vùng Đông Nam Bộ" },
    { province: "Bình Dương", total: 9878, natural: 1809, planted: 8069, coverage: 3.03, region: "Vùng Đông Nam Bộ" },
    { province: "Bình Phước", total: 159445, natural: 55978, planted: 103467, coverage: 22.66, region: "Vùng Đông Nam Bộ" },
    { province: "Tây Ninh", total: 66569, natural: 46425, planted: 20144, coverage: 16.16, region: "Vùng Đông Nam Bộ" },
    { province: "TP Cần Thơ", total: 0, natural: 0, planted: 0, coverage: 0, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Long An", total: 21826, natural: 838, planted: 20988, coverage: 4.00, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Tiền Giang", total: 2591, natural: 0, planted: 2591, coverage: 0.99, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Bến Tre", total: 4482, natural: 1250, planted: 3232, coverage: 1.83, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Trà Vinh", total: 9539, natural: 2955, planted: 6583, coverage: 4.07, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Vĩnh Long", total: 0, natural: 0, planted: 0, coverage: 0, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "An Giang", total: 13907, natural: 1117, planted: 12789, coverage: 3.68, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Đồng Tháp", total: 6041, natural: 0, planted: 6041, coverage: 1.68, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Kiên Giang", total: 76700, natural: 58020, planted: 18680, coverage: 11.93, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Hậu Giang", total: 3794, natural: 0, planted: 3794, coverage: 1.83, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Sóc Trăng", total: 10246, natural: 1733, planted: 8513, coverage: 2.54, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Bạc Liêu", total: 4488, natural: 1906, planted: 2581, coverage: 1.61, region: "Vùng đồng bằng sông Cửu Long" },
    { province: "Cà Mau", total: 93093, natural: 11535, planted: 81557, coverage: 14.74, region: "Vùng đồng bằng sông Cửu Long" }
  ];

  // Process data and map province names
  rawData.forEach(item => {
    data.push({
      ...item,
      displayName: provinceMapping[item.province] || item.province
    });
  });

  return data;
};

// Create regional summary data
const getRegionalData = (provinceData) => {
  const regions = {};
  
  provinceData.forEach(province => {
    if (!regions[province.region]) {
      regions[province.region] = {
        name: province.region,
        provinces: [],
        totalArea: 0,
        naturalForest: 0,
        plantedForest: 0,
        avgCoverage: 0
      };
    }
    
    regions[province.region].provinces.push(province);
    regions[province.region].totalArea += province.total;
    regions[province.region].naturalForest += province.natural;
    regions[province.region].plantedForest += province.planted;
  });
  
  // Calculate average coverage for each region
  Object.values(regions).forEach(region => {
    const totalProvinces = region.provinces.length;
    let sum = 0;
    region.provinces.forEach(province => {
      sum += province.coverage;
    });
    region.avgCoverage = totalProvinces > 0 ? (sum / totalProvinces).toFixed(2) : 0;
  });
  
  return Object.values(regions);
};

// Get color for coverage percentage
const getCoverageColor = (coverage) => {
  if (coverage >= 60) return 'bg-green-800';
  if (coverage >= 50) return 'bg-green-700';
  if (coverage >= 40) return 'bg-green-600';
  if (coverage >= 30) return 'bg-green-500';
  if (coverage >= 20) return 'bg-green-400';
  if (coverage >= 10) return 'bg-green-300';
  if (coverage > 0) return 'bg-green-200';
  return 'bg-gray-200';
};

// Vietnam map component with province SVG
const VietnamMap = ({ provinceData, selectedProvince, onProvinceClick }) => {
  // Create a mapping of province names to their data
  const provinceDataMap = {};
  provinceData.forEach(province => {
    provinceDataMap[province.displayName] = province;
  });

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 500 800" className="w-full">
        {/* Northern provinces */}
        <g>
          <path 
            d="M220,120 L240,110 L260,100 L280,105 L290,120 L310,125 L320,135 L315,155 L300,170 L280,175 L265,165 L250,170 L240,160 L230,145 L220,120Z" 
            className={`${getCoverageColor(provinceDataMap["Cao Bằng"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Cao Bằng"])}
          />
          <path 
            d="M220,120 L240,110 L200,100 L180,110 L175,125 L195,140 L210,145 L230,145 L220,120Z" 
            className={`${getCoverageColor(provinceDataMap["Hà Giang"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Hà Giang"])}
          />
          <path 
            d="M195,140 L175,125 L160,135 L155,155 L170,175 L190,180 L210,165 L230,145 L210,145 L195,140Z" 
            className={`${getCoverageColor(provinceDataMap["Tuyên Quang"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Tuyên Quang"])}
          />
          <path 
            d="M240,160 L250,170 L265,165 L280,175 L270,185 L255,195 L240,190 L225,175 L230,145 L240,160Z" 
            className={`${getCoverageColor(provinceDataMap["Bắc Kạn"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Bắc Kạn"])}
          />
          <path 
            d="M300,170 L315,155 L330,165 L345,160 L355,175 L340,190 L310,195 L290,185 L280,175 L300,170Z" 
            className={`${getCoverageColor(provinceDataMap["Lạng Sơn"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Lạng Sơn"])}
          />
          <path 
            d="M190,180 L170,175 L155,155 L135,160 L120,180 L135,200 L155,205 L175,195 L190,180Z" 
            className={`${getCoverageColor(provinceDataMap["Yên Bái"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Yên Bái"])}
          />
          <path 
            d="M175,125 L180,110 L165,90 L145,95 L125,110 L120,130 L135,160 L155,155 L175,125Z" 
            className={`${getCoverageColor(provinceDataMap["Lào Cai"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Lào Cai"])}
          />
          <path 
            d="M125,110 L100,95 L90,110 L95,135 L120,130 L125,110Z" 
            className={`${getCoverageColor(provinceDataMap["Lai Châu"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Lai Châu"])}
          />
          <path 
            d="M95,135 L90,110 L70,115 L60,140 L75,160 L100,170 L120,180 L135,160 L120,130 L95,135Z" 
            className={`${getCoverageColor(provinceDataMap["Sơn La"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Sơn La"])}
          />
          <path 
            d="M60,140 L70,115 L50,105 L30,125 L35,150 L60,140Z" 
            className={`${getCoverageColor(provinceDataMap["Điện Biên"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Điện Biên"])}
          />
          <path 
            d="M120,180 L100,170 L75,160 L50,175 L65,200 L85,210 L110,195 L135,200 L120,180Z" 
            className={`${getCoverageColor(provinceDataMap["Hoà Bình"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Hoà Bình"])}
          />
          <path 
            d="M225,175 L240,190 L255,195 L270,185 L280,175 L290,185 L275,200 L255,215 L235,205 L225,175Z" 
            className={`${getCoverageColor(provinceDataMap["Thái Nguyên"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Thái Nguyên"])}
          />
          <path 
            d="M290,185 L310,195 L305,210 L285,215 L275,200 L290,185Z" 
            className={`${getCoverageColor(provinceDataMap["Bắc Giang"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Bắc Giang"])}
          />
          <path 
            d="M210,165 L190,180 L175,195 L185,215 L205,225 L235,205 L225,175 L210,165Z" 
            className={`${getCoverageColor(provinceDataMap["Phú Thọ"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Phú Thọ"])}
          />
          
          {/* Red River Delta provinces */}
          <path 
            d="M235,205 L255,215 L245,235 L225,240 L205,225 L235,205Z" 
            className={`${getCoverageColor(provinceDataMap["Vĩnh Phúc"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Vĩnh Phúc"])}
          />
          <path 
            d="M255,215 L275,200 L285,215 L275,230 L265,235 L245,235 L255,215Z" 
            className={`${getCoverageColor(provinceDataMap["Bắc Ninh"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Bắc Ninh"])}
          />
          <path 
            d="M285,215 L305,210 L320,220 L310,230 L290,235 L275,230 L285,215Z" 
            className={`${getCoverageColor(provinceDataMap["Hải Dương"]?.coverage || 0)} stroke-gray-500 hover:stroke-black cursor-pointer`}
            onClick={() => onProvinceClick(provinceDataMap["Hải Dương"])}
          />
          <path 
            d="M310,