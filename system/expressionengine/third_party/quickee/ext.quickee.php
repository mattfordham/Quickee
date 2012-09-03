<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Quickee
 *
 * @package   quickee
 * @category  Extension
 * @author    Matt Fordham
 * @link    http://www.matthewfordham.com
 * @copyright Copyright (c) 2012, Matt Fordham
 */

class Quickee_ext {
  
  public $settings    = array();
  public $description   = 'A handy quick navigation launcher for ExpressionEngine, kinda like Quicksilver/LaunchBar/Alfred';
  public $docs_url    = 'https://github.com/mattfordham/quickee';
  public $name      = 'Quickee';
  public $settings_exist  = 'n';
  public $version     = '1.0';
  
  private $EE;
  
  /**
   * Constructor
   *
   * @param   mixed Settings array or empty string if none exist.
   */
  public function __construct($settings = '')
  {
    $this->EE =& get_instance();
    $this->settings = $settings;
  }// ----------------------------------------------------------------------
  
  /**
   * Activate Extension
   *
   * This function enters the extension into the exp_extensions table
   *
   * @return void
   */
  public function activate_extension()
  {
    // Setup custom settings in this array.
    $this->settings = array();
    
    $data = array(
                  'class'   => __CLASS__,
                  'method'  => 'cp_menu_array',
                  'hook'    => 'cp_menu_array',
                  'settings'  => serialize($this->settings),
                  'version' => $this->version,
                  'enabled' => 'y'
                  );

    $this->EE->db->insert('extensions', $data);     
    
  } 

  // ----------------------------------------------------------------------
  
  /**
   * cp_js_end
   *
   * @return void
   */
  public function cp_menu_array($menu)
  {
    $this->_include_static();
    return $menu;
  }

  function _theme_url()
  {
    if (! isset($this->cache['theme_url']))
    {
      $theme_folder_url = defined('URL_THIRD_THEMES') ? URL_THIRD_THEMES : $this->EE->config->slash_item('theme_folder_url').'third_party/';
      $this->cache['theme_url'] = $theme_folder_url.'quickee/';
    }
    return $this->cache['theme_url'];
  }

  private function _include_static()
  {
    if (! isset($this->cache['static_included']))
    {
      $this->EE->cp->add_to_head('<link rel="stylesheet" type="text/css" href="'.$this->_theme_url().'quickee.css" />');
      $this->EE->cp->add_to_foot('<script type="text/javascript" src="'.$this->_theme_url().'quickee.js"></script>');
      $this->cache['static_included'] = TRUE;
    }
  }

  // ----------------------------------------------------------------------

  /**
   * Disable Extension
   *
   * This method removes information from the exp_extensions table
   *
   * @return void
   */
  function disable_extension()
  {
    $this->EE->db->where('class', __CLASS__);
    $this->EE->db->delete('extensions');
  }

  // ----------------------------------------------------------------------

  /**
   * Update Extension
   *
   * This function performs any necessary db updates when the extension
   * page is visited
   *
   * @return  mixed void on update / false if none
   */
  function update_extension($current = '')
  {
    if ($current == '' OR $current == $this->version)
    {
      return FALSE;
    }
  } 
  
  // ----------------------------------------------------------------------
}

/* End of file ext.quickee.php */