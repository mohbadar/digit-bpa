package org.egov.infra.custom;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.egov.infra.admin.master.entity.City;
import org.egov.infra.admin.master.service.CityService;
import org.egov.infra.config.core.ApplicationThreadLocals;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

@Service
public class CustomImplProvider {
	public static final String ULB_CODE = "ULB_CODE";
	public static final String ULB_NAME = "ULB_NAME";
	public static final String DISTRICT_CODE = "DISTRICT_CODE";
	public static final String DISTRICT_NAME = "DISTRICT_NAME";
	public static final String GRADE = "GRADE";
	public static final String STATE_NAME = "STATE_NAME";
	private static final Logger LOG = Logger.getLogger(CustomImplProvider.class);

	@Value("${client.id}")
	private String clientId;
	
	@Autowired
	private ApplicationContext applicationContext;
	@Autowired
	private CityService cityService;

	@Deprecated()
	public Map<String, String> getCityDetails() {
		LOG.info("Getting city Details");
		Map<String, String> cityDetails = new HashMap<>();
		try {
			cityDetails.put(STATE_NAME, clientId);
			cityDetails.put(ULB_CODE, ApplicationThreadLocals.getCityCode());
			City city = cityService.getCityByCode(ApplicationThreadLocals.getCityCode());
			if (city != null) {
				cityDetails.put(ULB_NAME, city.getName());
				cityDetails.put(DISTRICT_CODE, city.getDistrictCode());
				cityDetails.put(DISTRICT_NAME, city.getDistrictName());
				cityDetails.put(STATE_NAME, clientId);
				cityDetails.put(GRADE, city.getGrade());
			}
			LOG.info(cityDetails);

		} catch (Exception e) {

			LOG.error("Error while getting city Details", e);
		}

		LOG.info("Getting city Details completed");
		return cityDetails;
	}

	public Object find(String beanName, Map<String, String> cityDetails) {
		Object bean = applicationContext.getBean(beanName);
		return find(bean.getClass(), cityDetails);

	}

	/**
	 * 
	 * @param <T>
	 * @param <T>
	 * @param parentClazz
	 * @param cityDetails
	 * @return
	 * 
	 * 		1.Find if the city specific file is present 2.Find if the
	 *         District file present 3.Find if the type of municipality file
	 *         present 4.
	 * 
	 */

	public Object find(Class parentClazz, Map<String, String> cityDetails) {
		Object ulbBean = null;
		Object districtBean = null;
		Object stateBean = null;
		Object gradeBean = null;
		Object defaultBean = null;
		Object bean = null;

		try {
			Map beans = applicationContext.getBeansOfType(parentClazz);
			Set<String> keySet = beans.keySet();

			for (String s : keySet) {

				Object c = beans.get(s);
				String serviceName = c.getClass().getSimpleName().toLowerCase();
				if (!serviceName.contains(parentClazz.getSimpleName().toLowerCase())) {
					continue;
				}

				if (!ApplicationThreadLocals.getCityName().isEmpty()
						&& serviceName.contains(ApplicationThreadLocals.getCityName().toLowerCase())) {
					ulbBean = c;
					break;
				}
				if (!ApplicationThreadLocals.getDistrictName().isEmpty()
						&& serviceName.contains(ApplicationThreadLocals.getDistrictName().toLowerCase())) {
					if (serviceName.contains("District".toLowerCase())) {
						districtBean = c;
					}
				}

				if (!ApplicationThreadLocals.getStateName().isEmpty()
						&& serviceName.contains(ApplicationThreadLocals.getStateName().toLowerCase())) {
					stateBean = c;
				}

				if (!ApplicationThreadLocals.getGrade().isEmpty()
						&& serviceName.contains(ApplicationThreadLocals.getGrade().toLowerCase())) {
					gradeBean = c;
				}
			}

			if (ulbBean != null) {
				bean = ulbBean;
				LOG.debug("Returning ulb implementation for service " + parentClazz + " : "
						+ ulbBean.getClass().getName());
			} else if (districtBean != null) {
				bean = districtBean;
				LOG.debug("Returning district implementation for service " + parentClazz + " : "
						+ bean.getClass().getName());
			} else if (gradeBean != null) {
				bean = gradeBean;
				LOG.debug("Returning Gradewise implementation for service " + parentClazz + " : "
						+ gradeBean.getClass().getName());
			} else if (stateBean != null) {
				bean = stateBean;
			}

			else {
				LOG.debug("returning default implementation for " + parentClazz);
				String beanName = parentClazz.getSimpleName();
				beanName = beanName.substring(0, 1).toLowerCase() + beanName.substring(1);
				defaultBean = applicationContext.getBean(beanName);
				bean = defaultBean;
			}

			if (bean == null) {
				LOG.error("No Service Found for " + parentClazz.getClass().getSimpleName());
			}

		} catch (BeansException e) {
			LOG.error("No Bean Defined for the Rule " + parentClazz, e);
		} catch (Exception e) {
			LOG.error("Exception in finding bean" + parentClazz, e);
		}
		return bean;
	}
}
